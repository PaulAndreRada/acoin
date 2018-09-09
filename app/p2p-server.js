const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
// check if the peer adresses are present,
// if found split the adresses in the string by ","
// else, make it an empty array
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION'
};

class P2pServer {
  constructor(blockchain, transactionPool) {
    // takes the blockchain from the peer
    this.blockchain = blockchain;
    // takes the transaction pools across users to get them up to date
    this.transactionPool = transactionPool;
    // will have a list of all of the peers connected
    this.sockets = [];
  }

  // will start up the server and create it
  listen() {
    // use a server class inside the ws module, use either the user's port variable or the one we specified up there^
    const server = new WebSocket.Server({ port: P2P_PORT });
    // event listener sent to the server
    // fire callback whenever a new socket connects with this server
    server.on('connection', socket => this.connectSocket(socket));
    // make sure that later instances connect to this and other instances
    this.connectToPeers();

    console.log(`listening for peer to peer connections on ${P2P_PORT}`);
  }

  connectToPeers() {
    // look for each peer in the array
    peers.forEach(peer =>{
      // peers will look like:
      // ws://localhost:5001
      // open those sockets
      const socket = new WebSocket(peer);

      // for each socket, create an event listener for when they open
      // then connect to them
      socket.on('open', () => this.connectSocket(socket));
    })
  }

  /*
  Use cases for connectSocket include:
  -A new chain has been created
  */
  connectSocket(socket) {
    // push this socket to the array of sockets
    this.sockets.push(socket);
    console.log('Socket connected');
    // call the message handler event
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket){
    // create the message event
    socket.on('message', message => {
      // parse the json from the incoming message(chain) into javascript
      const data = JSON.parse(message);

      // act depending on the message type
      switch(data.type){
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
      }
      // take in the coming message's chain and check for replacement
      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket){
    // send this chain to the supplied socket
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  /*
  Use cases for this include:
  -a new block has been mined
  */
  syncChains(){
    // go trough all the sockets and send them this chains
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
}

module.exports = P2pServer;
