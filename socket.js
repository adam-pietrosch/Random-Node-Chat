function socket(io) {

    const rooms = {}
    const waiting = []

    io.on('connection', (socket) => {

        socket.on('language', (language) => {
            // add user to queue
            waiting.push({
                id: socket.id,
                language: language
            })

            //  if two users are in queue
            if (hasQueueTwoSpeakers()) {
                const twoUsers = getTwoSpeakers()
                const firstUser = twoUsers[0].id
                const secondUser = twoUsers[1].id
                // join emtpy room or create new one
                const emptyRoom = findEmptyRoom()
                if (emptyRoom) {
                    rooms[emptyRoom] = [firstUser, secondUser]
                }
                else {
                    var roomsCount = Object.keys(rooms).length
                    rooms[roomsCount + 1] = [firstUser, secondUser]
                }
                // both users join same room
                io.sockets.connected[firstUser].join(findRoom(firstUser))
                io.sockets.connected[secondUser].join(findRoom(secondUser))
                // remove these users from queue
                console.log(rooms)
                waiting.splice(waiting.indexOf(getObjectFromQueue(firstUser)), 1)
                waiting.splice(waiting.indexOf(getObjectFromQueue(secondUser)), 1)    
                console.log(waiting)           
            }

            // send message to room user is connected
            if (!waiting.includes(socket.id)) {
                io.in(findRoom(socket.id)).emit('user connected')
            }
        })

        socket.on('send message', (message) => {          
            // send message to room where user is
            socket.to(findRoom(socket.id)).emit('message', message)
        })

        socket.on('disconnect', () => {
            // if user is in queue then remove him
            if (isInQueue(socket.id)) {
                return waiting.splice(waiting.indexOf(getObjectFromQueue(socket.id)), 1)
            }
            // remove user from room
            const roomNumber = findRoom(socket.id)
            socket.to(roomNumber).emit('user disconnected')
            socket.leave(roomNumber)
            if (!roomNumber) return
            rooms[roomNumber].splice(rooms[roomNumber].indexOf(socket.id), 1)
        });
    });

    function findRoom(socketId) {
        return Object.keys(rooms).find(room => rooms[room].includes(socketId))
    }

    function findEmptyRoom() {
        return Object.keys(rooms).find(room => rooms[room].length === 0)
    }

    function isInQueue(id) {
        waiting.forEach(user => {
            if (user.id === id) return true
        })
    }

    function getObjectFromQueue(id) {
        waiting.forEach(user => {
            if (user.id === id) return user
        })
    }

    function hasQueueTwoSpeakers() {
        var usersByLanguage = [
            waiting.filter(user => user.language === 'English'),
            waiting.filter(user => user.language === 'German'),
            waiting.filter(user => user.language === 'Czech') 
        ]

        for (var num in usersByLanguage) {
            if (usersByLanguage[num].length > 1) {
                return true
                break
            }
        }
    }

    function getTwoSpeakers() {
        var usersByLanguage = [
            waiting.filter(user => user.language === 'English'),
            waiting.filter(user => user.language === 'German'),
            waiting.filter(user => user.language === 'Czech')
        ]

        for (var i in usersByLanguage) {
            if (usersByLanguage[i].length > 1) {
                return usersByLanguage[i]
                break
            }
        }
    }

}



module.exports = socket