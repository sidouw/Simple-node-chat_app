const socket = io()
//Elements
const $MessageForm = document.querySelector('#MsgForm')
const $MessageFormInput = $MessageForm.querySelector('input')
const $MessageFormBtn = $MessageForm.querySelector('button')
const $LocationBtn = document.querySelector('#Location_Btn')
const $Messages = document.querySelector('#Messages')

//templates
const messagetemplate = document.querySelector('#Message-Template').innerHTML
const locationtemplate = document.querySelector('#Location-Template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-Template').innerHTML
// options
 const options = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    //new msg elem
    const $newMessage = $Messages.lastElementChild

    //height of new msg
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
     
    //visible height 
    const visibleheight = $Messages.offsetHeight

    //height of messages container 
    const containerHeight = $Messages.scrollHeight

    // how Far have i scrolled??
    const scrollOffset = $Messages.scrollTop + visibleheight

    if(containerHeight -newMessageHeight<=scrollOffset){
        $Messages.scrollTop = $Messages.scrollHeight
    }
}


socket.emit('join',options,(error)=>{
    if (error) {
        alert(error)
        location.href='/'
    }
})

socket.on('message',(msg)=>{

    console.log(msg)
    const html = Mustache.render(messagetemplate,{
        msg:msg.text,
        username:msg.username,
        createdAt : moment(msg.createdAt).format('H:mm A')
    })
    $Messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('LocationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationtemplate,{
        url: url.text,
        username:msg.username,
        createdAt : moment(url.createdAt).format('H:mm A')
    })
    $Messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    console.log(room,users)
    const html = Mustache.render(sidebartemplate,{
        room,
        users    
    })
    document.querySelector('#sidebar').innerHTML =html
})

$MessageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $MessageFormBtn.setAttribute('disabled','disabled')
    socket.emit('sendMessage',e.target.elements.message.value,(msg)=>{
        console.log(msg)
        $MessageFormBtn.removeAttribute('disabled')
        $MessageFormInput.value=''
        $MessageFormInput.focus()
    })
})


$LocationBtn.addEventListener('click',()=>{
    if (!navigator.geolocation) {
        return alert('Your browser does not support sharing location')
    }
    $LocationBtn.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            lat:position.coords.latitude,
            long:position.coords.longitude
        },(msg)=>{
            $LocationBtn.removeAttribute('disabled')
           console.log(msg)
        })
    })
    
})