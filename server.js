//Arquivo server.js

//Importa o módulo net, responsável por criar a comunicação TCP entre client e servidor.
const net = require('net');

//Array com nome arraySockets que irá armazenar nossos sockets
let arraySockets = [];

//Cria o servidor com o módulo net, retorna um objeto do tipo net.Server, que é uma classe usada para criar um servidor TCP.
//Esse método automaticamente espera por eventos de conexão, e assim que o cliente solicitar, o servidor cria um objeto net.Socket para se comunicar.
const server = net.createServer(socket => {
    
    //Assim que um cliente se conectar, ele será adicionado ao array de sockets e irá printar na tela do servidor.
    //Esse array é importante pois toda vez que uma mensagem for enviada, ela será transmitida por todos os sockets, percorrendo todo o array.
    arraySockets.push(socket);
    console.log('Novo cliente conectado.');
    
    //Aqui iremos "escutar" por novas mensagens, utilizando o método on esperando por data(dados)
    socket.on('data', data => {
        broadcast(data, socket); //Broadcast vai pegar os dados e enviar para todos os sockets, exceto para ele mesmo
    });
    
    //Quando receber algum error, significa que algum cliente se desconectou, mostrando uma mensagem no servidor.
    socket.on('error', err => {
        console.log('Um cliente se desconectou.');
    });
    
    //Quando um usuário envia o "sair" no chat, ele envia o evento "close", mostrando uma mensagem no servidor.
    socket.on('close', () => {
        console.log("Um cliente saiu do chat.");
    });

});

//Número da porta que o servidor irá utilizar para se comunicar com os clientes através do TCP.
server.listen(3200, () => {
    console.log('Chat online na porta 3200.')
});

//Função que recebe a mensagem e o socket que a enviou, ela irá distribuir para todos, exceto para o autor da mensagem
function broadcast(message, socketSent) {
    if (message === 'sair') { // Se a mensagem enviada for "sair", 
        const index = arraySockets.indexOf(socketSent); //Iremos identificar qual é o número do socket daquele usuário 
        arraySockets.splice(index, 1); //E iremos remover ele do arraySockets, fazendo com que ele fique offline.
    } else { //Se a mensagem não for "sair";
        arraySockets.forEach(socket => { //Método para fazer um loop em cada socket
            if (socket !== socketSent) socket.write(message); //Para cada socket que não for o autor da mensagem, vamos escrever a mensagem.
        });
    }
}