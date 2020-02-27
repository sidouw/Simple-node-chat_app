const users = []

const adduser = ({id,username,room})=>{
    
     username = username.trim().toLowerCase()
     room = room.trim().toLowerCase()

    if (!username || !room) {
        return {error :'user name & room are required !!'}
    }

    const existinguser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    if (existinguser) {
        return  {error :'user name already exists !!'}
    }

    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeuser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)

    const user = users.splice(index,1)[0]
    return user
}
const getUser = (id)=>{
    return users.find((user)=>{
        return user.id ===id
    })
}

const getUsersInRoom = (room)=>{
    return users.filter((user)=>{
        return user.room=== room
    })
}

module.exports ={
    adduser,
    removeuser,
    getUser,
    getUsersInRoom
}