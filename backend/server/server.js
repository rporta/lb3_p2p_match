var loopback = require('loopback');
var boot = require('loopback-boot');
var https = require('https');
var fs = require('fs');
var path = require('path');
var os = require('os');
var socketIo = require('socket.io'); // <--- Asegúrate de tenerlo requerido

var app = module.exports = loopback();

function getLocalIpAddress() {
    var interfaces = os.networkInterfaces();
    var fallbackIp = 'localhost';

    for (var devName in interfaces) {
        var ifaceList = interfaces[devName];
        for (var i = 0; i < ifaceList.length; i++) {
            var alias = ifaceList[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                if (alias.address.startsWith('192.168.') || alias.address.startsWith('10.')) {
                    return alias.address;
                }
                fallbackIp = alias.address;
            }
        }
    }
    return fallbackIp;
}

app.start = function() {
    var port = app.get('port');
    var host = app.get('host');
    var localIp = getLocalIpAddress();

    var server;

    try {
        var privateKey = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');
        var certificate = fs.readFileSync(path.join(__dirname, 'cert.pem'), 'utf8');
        var credentials = { key: privateKey, cert: certificate };

        // Crear servidor HTTPS con LoopBack
        server = https.createServer(credentials, app);
        console.log('🔒 Servidor configurado en modo HTTPS seguro.');
    } catch (e) {
        console.log('⚠️ No se encontraron certificados SSL. Iniciando en HTTP...');
        var http = require('http');
        server = http.createServer(app);
    }

    // 🔴 VINCULAR SOCKET.IO AL SERVIDOR HTTPS/HTTP CREADO
    var io = socketIo(server, {
        cors: {
            origin: "*", // Permitir conexiones desde cualquier origen local
            methods: ["GET", "POST"]
        }
    });

      let activeClients = [];

      io.on('connection', (socket) => {
        console.log('Usuario conectado por Socket.IO:', socket.id);

        activeClients.push(socket.id);
        socket.emit('WELCOME', { id: socket.id });
        io.emit('CLIENT_LIST', { clients: activeClients });

        // Reenviar señales WebRTC usando el método compatible .get() de Socket.IO v4
        socket.on('SIGNAL', function(data) {


          var targetSocket = io.sockets.sockets.get(data.targetId);
          if (targetSocket) {
            targetSocket.emit('SIGNAL', {
              senderId: socket.id,
              payload: data.payload
            });
          }
        });

        socket.on('disconnect', () => {
          console.log('Usuario desconectado:', socket.id);
          activeClients = activeClients.filter(id => id !== socket.id);
          io.emit('CLIENT_LIST', { clients: activeClients });
        });
      });

    server.listen(port, host, function() {
        app.emit('started');

        console.log('----------------------------------------------------');
        console.log('🚀 Servidor de señalización corriendo...');
        console.log('💻 Para abrir en esta PC:     https://localhost:%s', port);
        console.log('📱 Para abrir en tu Android:  https://%s:%s', localIp, port);
        console.log('----------------------------------------------------');
    });

    return server;
};

boot(app, __dirname, function(err) {
    if (err) throw err;

    if (require.main === module) {
        app.start();
    }
});