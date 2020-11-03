var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});

server.lastPlayderID = 0; // Keep track of the last id assigned to a new player

io.on('connection',function(socket){//sempre que um cliente se conecta no servidor:
    socket.on('newplayer',function(){//especifica retorno de chamada que lida com diferentes mensagens
        socket.player = {//criação de objeto personalizado que represenda o jogador
            id: server.lastPlayderID++,//id do jogador
            x: randomInt(100,400),//posições x y do jogador
            y: randomInt(100,400)
        };
        //enviar jogador para lista de jogadores conectados
        socket.emit('allplayers',getAllPlayers());//envia mensagem allplayers para socket+saída gettAllPlayers
        socket.broadcast.emit('newplayer',socket.player);//envia mensagem a todos os sockets conectados exceto o que acionou a chamada de retorno

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
});

function getAllPlayers(){//matriz de jogadores conectados
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}