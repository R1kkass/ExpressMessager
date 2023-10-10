const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const roomRouter = require('./userRouter')

router.get('/init', (req,res)=>{
    return res.json({
        message: true
    })
})
router.use('/user', userRouter)
router.use('/rooms', roomRouter)

module.exports = router
