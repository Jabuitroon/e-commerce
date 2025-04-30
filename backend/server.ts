import express from 'express'
import cors from 'cors'

import { products } from './productos.json'

const app = express()
const port = process.env.PORTT ?? 3000
app.use(cors())

type myContrato = {
  title: string
  image: string
  url: string
  asin: string
  star_rating: string
  global_ratings?: string
  bought_in_past_month?: string
  price_symbol: string
  price: string
  is_prime?: boolean
  is_climate_pledge_friendly?: boolean
  is_best_seller?: boolean
  is_sponsored?: boolean
  is_limited_time_deal?: boolean
}

app.get('/products', async (req, res): Promise<any> => {
  let productsForFront: any = []

  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    productsForFront = products?.map((obj: myContrato) => ({
      id: obj.asin,
      name: obj.title,
      price: obj.price,
      price_symbol: obj.price_symbol,
      img: obj.image,
    }))
  } catch (error) {
    return res.status(500).json({ message: 'Error al mapear keys' })
  }

  return res.status(200).json({ data: products })
})

app.get('/search', async (req, res): Promise<any> => {
  const { q } = req.query

  if (!q) {
    return res.status(500).json({ message: 'El parámetro `q` es requerido.' })
  }

  if (Array.isArray(q)) {
    return res
      .status(500)
      .json({ message: 'El parámetro `q` debe ser un string.' })
  }

  const search = q?.toString().toLocaleLowerCase()

  const normalizedSearch = search.toLowerCase()

  const filteredData = normalizedSearch
    ? products.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(normalizedSearch)
        )
      )
    : products

  console.log('filter', filteredData)

  // 4. Retornar 200 con la información filtrada
  return res.status(200).json({ data: filteredData })
})

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`)
})
