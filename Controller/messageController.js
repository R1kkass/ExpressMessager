const jwt = require("jsonwebtoken")
const Message = require("../Model/Message")

class MessageController{
    async create() {
        const {message, idRoom} = req.body

        const {access_token} = req.headers

        const decode = jwt.decode(access_token)

        const userToken=await User.findOne({
            _id: decode.id
        })

        const messageRes = await Message.create({
            user: {
                _id:userToken._id,
                name: userToken.name,
                secondName: userToken.secondName,
                email: userToken.email,
            },
            message,
            date: Date.now()
        })
        const messages = await Message.find({idRoom})

        return res.json(messages)
    }
}

module.exports = new MessageController()