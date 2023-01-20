//Arquivo client.js

//Importa o módulo net, responsável por criar a comunicação TCP entre client e servidor.
const net = require('net');

//Importa o módulo "readline", responsável por escrever e ler as menssagens no console do servidor.
const readLine = require('readline').createInterface({
    input: process.stdin, //Leitura
    output: process.stdout //Saída
});

//Promise, é um objeto que espera uma resposta, nesse caso o servidor irá perguntar ao usuário o seu nick, e ele só poderá prosseguir se enviar o nome.
new Promise(resolve => {
    readLine.question('Digite um nome de usuário para entrar no chat: ', answer => { //Pergunta ao usuário o seu nome e espera uma resposta.
        resolve(answer); //Envia a resposta
    });
}).then((nickname) => { //Com a resposta do nome, então(then) podemos continuar

    const socket = net.connect({ //Conecta com o socket na porta 3200, necessita ser a mesma do servidor
        port: 3200
    });

    readLine.on('line', data => { //Identifica que o usuário enviou uma menságem
        if (data === 'sair') { // Se a mensagem foi "sair"
            socket.write(`O usuário ${nickname} saiu do chat.`);//Anuncia no chat que o usuário se desconectou
            socket.setTimeout(1000); //Tempo de 1 segundo para que o servidor tenha tempo de retirar o usuário que pediu para sair.
        } else { //Se a mensagem não foi "sair"
            socket.write(nickname + ': ' + data); //Envia a mensagem normalmente, juntamente do nick do usuário
        }
    });

    socket.on('connect', () => { //Identifica o evento de "connect"
        socket.write('O usuário ' + nickname + ' entrou no chat.');//Envia no chat que um novo usuário se conectou.
    });

    socket.on('data', data => { //Identifica que foi enviado dados no chat
        console.log('\x1b[33m%s\x1b[0m', data);//Envia a mensagem no chat com comando para mudar a cor das mensagens de outros usuários.
    });

    socket.on('timeout', () => {//Sempre que houver um timeout(um tempo de espera), que só enviado pelo comando "sair"
        socket.write('sair'); //Iremos escrever "sair" para o servidor
        socket.end(); //Envia o evento end
    });

    socket.on('end', () => {//Quando receber o evento de end
        process.exit(); //Encerra o chat completamente para o usuário.
    });

    socket.on('error', () => { //Quando tiver algum erro
        console.log('O servidor parece estar offline.'); //Envia a mensagem de que o servidor está desligado.
    });
});