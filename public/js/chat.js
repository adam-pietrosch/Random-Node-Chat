var socket = io();

var container = document.querySelector('.container')
var input = document.getElementById('mess-input')
var sendButton = document.querySelector('.input > i')

socket.emit('language', language)

socket.on('user connected', () => {
    input.disabled = false
    var waitInfo = document.getElementById('waiting')
    waitInfo.innerHTML = '<p>user connected</p><i class="material-icons">done</i>'
})

sendButton.addEventListener('mousedown', (e) => {
    var message = input.value
    if (!message || message.trim().length === 0) return input.value = ''
    socket.emit('send message', message)
    createMyMsg(message)
    input.value = ''
})

input.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault()
        var message = input.value
        if (!message || message.trim().length === 0) return input.value = ''
        socket.emit('send message', message)
        createMyMsg(message)
        input.value = ''
    }
})

socket.on('message', (message) => {
    createYourMsg(message)
})

socket.on('user disconnected', () => {
    createInfo('user is disconnected')
    createNewChatButton()
    input.disabled = true
})

function createMyMsg(text) {
    var message = document.createElement('div')
    message.classList.add('message')
    message.classList.add('me')
    var date = new Date()
    var hour = date.getHours()
    var minutes = date.getMinutes()

    message.innerHTML = `<p>${text}</p><span>${hour} : ${minutes}</span>`
    container.appendChild(message)
    window.scrollTo(0, document.body.scrollHeight);
}

function createYourMsg(text) {
    var message = document.createElement('div')
    message.classList.add('message')
    message.classList.add('you')
    var date = new Date()
    var hour = date.getHours()
    var minutes = date.getMinutes()

    container.appendChild(message)

    // typing effect
    var count = 1
    var cutText = text.substring(0, count)
    message.innerHTML = `<p>${cutText}</p><span>${hour} : ${minutes}</span>`
    window.scrollTo(0, document.body.scrollHeight);
    if (count < text.length) {
        setInterval(() => {
            count++
            var cutText = text.substring(0, count)
            message.firstChild.innerHTML = cutText
        }, 100);
    }  
}

function createInfo(text) {
    var info = document.createElement('div')
    info.classList.add('info')
    info.innerHTML = `<p>${text}</p>`
    if (text === 'user is disconnected') info.innerHTML = `<p>${text}</p><i class="material-icons">close</i>`
    container.appendChild(info)
    window.scrollTo(0, document.body.scrollHeight);
}

function createNewChatButton() {
    var info = document.createElement('div')
    info.classList.add('info')
    info.innerHTML = `<a href="/chat">new chat</a>`
    container.appendChild(info)
    window.scrollTo(0, document.body.scrollHeight);
}
