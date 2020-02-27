const generatemessage = (text,username)=>{
    return {
        username,
        text,
        createdAt : new Date().getTime()
    }
}
const generatelocationmessage = (url)=>{
    return {
        url,
        createdAt : new Date().getTime()
    }
}
module.exports={
    generatemessage,
    generatelocationmessage
}