import { NextFunction, Request, Response } from 'express'
import { OrdersDAO } from '../DAO/OrdersDAO'
import { OrdersFilterDTO, OrdersExportFilterDTO } from '../DTOs/orders.dto'
import { ordersToCSV } from '../utils/csv'

import {
  isValidAdminTransition,
  getValidAdminNextStatuses,
} from '../services/orderStatusMachine'
import { OrderStatus } from '../types/order'

const orderDao = new OrdersDAO()

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filterData = OrdersFilterDTO.parse(req.query)
    const result = await orderDao.getAll(filterData)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export const exportOrdersCSV = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filterData = OrdersExportFilterDTO.parse(req.query)
    const orders = await orderDao.getAllForExport(filterData)
    const csv = ordersToCSV(orders)

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="orders_${Date.now()}.csv"`,
    )
    res.status(200).send(csv)
  } catch (err) {
    next(err)
  }
}

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await orderDao.findById(req.params.id)
    if (!order) {
      res.status(404).json({ message: 'Orden no encontrada' })
      return
    }
    res.status(200).json(order)
  } catch (err) {
    next(err)
  }
}

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const { newStatus, reason } = req.body as {
      newStatus?: OrderStatus
      reason?: string
    }

    if (!newStatus) {
      res
        .status(400)
        .json({ message: 'newStatus es requerido y debe ser un estado válido' })
      return
    }

    const order = await orderDao.findById(id)
    if (!order) {
      res.status(404).json({ message: 'Orden no encontrada' })
      return
    }

    if (!isValidAdminTransition(order.ord_estado, newStatus)) {
      res.status(422).json({
        message: `Transición inválida: '${order.ord_estado}' -> '${newStatus}'`,
        validNextStatuses: getValidAdminNextStatuses(order.ord_estado),
      })
      return
    }

    if (newStatus === 'reembolso_solicitado' && !reason) {
      res.status(400).json({
        message: 'El motivo es requerido para solicitar una devolución',
      })
      return
    }

    await orderDao.updateStatus({
      orderId: Number(id),
      newStatus,
      reason: reason ?? null,
    })

    const updatedOrder = await orderDao.findById(id)
    res.json(updatedOrder)
  } catch (err) {
    next(err)
  }
}
