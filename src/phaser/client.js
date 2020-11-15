var Client = {};
Client.socket = io.connect();//inicia conexão com servidor sempre que um jogador navega por ele

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

// Client.sendClick = function(x,y){//recebe coordenadas do clique
//     Client.socket.emit('click',{x:x,y:y});
//  };

// Client.socket.on('newplayer',function(data){
//     Game.addNewPlayer(data.id,data.x,data.y);
// });

// Client.socket.on('allplayers',function(data){
//     console.log(data);
//     for(var i = 0; i < data.length; i++){
//         Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
//     }

//     Client.socket.on('move',function(data){
//         Game.movePlayer(data.id,data.x,data.y);
//     });

//     Client.socket.on('remove',function(id){
//         Game.removePlayer(id);
//     });
// });