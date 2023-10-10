require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const { Server } = require("socket.io");
const { createServer } = require("http");
const router = require('./router')
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors({
    credentials: true,
    origin: process.env.CORS_DOMEN || 'http://localhost:3000'
}))
app.use(express.json())
app.use('/api', router)


const start = async () => {
    try{
        await mongoose.connect(
            process.env.DB_PORT || 'mongodb://127.0.0.1:27017/Messanger'
        )
    httpServer.listen(4000, ()=>{
        console.log('rere');
    });

    }catch(e){
        console.log(e);
    }
}


start()



io.on("connection", (socket) => {
    
    socket.on('hi', (data) => {
        socket.join('123')
        
        console.log('hi', socket.rooms)
        socket.to('123').emit('hii', data)
    })
});
