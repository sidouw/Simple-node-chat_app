const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const Filter = require('bad-words')
const {generatemessage} = require('./Utils/message')
const {  adduser,
    removeuser,
    getUser,
    getUsersInRoom} = require('./Utils/users')


const PORT =process.env.PORT
const PublicPath = path.join(__dirname,'../Public')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(PublicPath))

io.on('connection',(socket)=>{
    console.log('New Webconnection')

    
    socket.on('join',({username,room},callback)=>{
        const {error,user} = adduser({id:socket.id,username,room})
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generatemessage("Welcome To this humble shit",'Chat-app ;)'))

        socket.broadcast.to(user.room).emit('message',generatemessage(`${user.username} has joined!!`,'Chat-app ;)'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })
    socket.on('sendMessage',(msg,callback)=>{
        const user = getUser(socket.id)
        filter =new Filter ()
        if(filter.isProfane(msg)){
           return  callback('Don\'t be an assh0le pls')
        }
        io.to(user.room).emit('message',generatemessage(msg,user.username))
        callback('Delivired!!')
    })

    socket.on('sendLocation',(location,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('LocationMessage',generatemessage(`https://google.com/maps?q=${location.lat},${location.long}`,user.username))
        callback('Location Shared!')
    })

    socket.on('disconnect',()=>{
        const user = removeuser(socket.id)
        if (user) {
            io.to(user.room).emit('message',generatemessage( `${user.username} has Left`,'Chat_App :\')'))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })

})

server.listen(PORT,()=>{
    console.log('Listning on port '+PORT)
})
