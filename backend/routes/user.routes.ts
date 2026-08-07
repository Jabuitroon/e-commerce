import { Router } from 'express'
import { getProfile } from '../controllers/user.controller'
import { authentication } from '../middlewares/auth.middleware'

const router = Router()
router.get('/profile', authentication, async (req, res) => {
  await getProfile(req, res)
})

export default router
// import express, { Router } from 'express'
// import {
//   protectedRoute,
//   deleteUser,
//   getUserById,
//   updateUser,
// } from '../controllers/user.controller'
// import { authentication, authorizeRoles } from '../middlewares/auth.middleware'
// const userRouter: Router = express.Router()

// /**
//  * @route   GET /api/users/protected
//  * @desc    A protected route
//  * @access  Admin/Distributor/Retailer
//  */
// userRouter.get('/protected', authentication, protectedRoute)

// /**
//  * @route   GET /api/users/:id
//  * @desc    Get a user by email
//  * @access  Admin/Distributor/Retailer (self)
//  */
// userRouter.get('/:id', authentication, getUserById)

// /**
//  * @route   DELETE /api/users/:id
//  * @desc    Delete a user
//  * @access  Admin
//  */
// userRouter.delete('/:id', authentication, authorizeRoles(['admin']), deleteUser)

// /**
//  * @route   PUT /users/:id
//  * @desc    Update user details
//  * @access  Admin/Distributor/Retailer (self)
//  */
// userRouter.put('/:id', authentication, updateUser)

// export default userRouter
