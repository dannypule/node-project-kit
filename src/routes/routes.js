import express from 'express'
import passport from 'passport'

import AuthController from '../features/auth/AuthController'
import CompaniesController from '../features/companies/CompaniesController'
import UsersController from '../features/users/UsersController'
import SalesController from '../features/sales/SalesController'

require('./../middleware/passport')(passport)

const router = express.Router()
const authenticateViaToken = passport.authenticate('jwt', { session: false })

// ===================================================
// '/api/auth'
// =========================
router.post('/auth/login', AuthController.login)
router.post('/auth/register', AuthController.register)

// ===================================================
// '/api/companies'
// =========================
router.get('/companies', authenticateViaToken, CompaniesController.getCompanies) // only super admins
router.post('/companies', authenticateViaToken, CompaniesController.addCompany) // only super admins
router.put('/companies', authenticateViaToken, CompaniesController.updateCompany) // only super admins
router.delete('/companies', authenticateViaToken, CompaniesController.deleteCompany) // only super admins

// ===================================================
// '/api/users'
// =========================
router.get('/users', authenticateViaToken, UsersController.getUsers) // only super admins
router.post('/users', authenticateViaToken, UsersController.addUser) // only super admins
router.delete('/users', authenticateViaToken, UsersController.deleteUser) // only super admins

// ===================================================
// '/api/sales'
// =========================
router.get('/sales', authenticateViaToken, SalesController.getSales) // only super admins
router.post('/sales', authenticateViaToken, SalesController.getSalesByCompanyName) // @todo convert to get/:companyName // only super admins

export default router
