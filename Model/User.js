const { Schema, model } = require("mongoose");


const User = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    secondName: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true}
})


module.exports = model('User', User)