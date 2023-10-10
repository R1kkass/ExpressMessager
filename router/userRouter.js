const {Router} = require('express')
const userController = require('../Controller/userController')
const router = Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/refresh', userController.refresh)

module.exports = router