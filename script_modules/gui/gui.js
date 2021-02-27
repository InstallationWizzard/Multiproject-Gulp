const 
  app     = require('express')(),
  http    = require('http').Server(app),
  io      = require('socket.io')(http);

var 
  port = 3000,
  socket
function startServer(){
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    http.listen(3000, () => {
        console.log(`listening on *:${port}`);
    });

        
    http.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        port++;
        setTimeout(() => {
            http.close();
            http.listen(port);
        }, 1000);
        }
    });

    io.on('connection', (socket) => {
        console.log('Connected');
        // Setup
        socket.on('executeTask', (data) => {
        });
    });
}


module.exports = {startServer, io, socket}