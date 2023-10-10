const {Router} = require('express')
const roomsController = require('../Controller/roomsController')
const router = Router()

router.post('/create', roomsController.createRoom)