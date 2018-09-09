const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

// use bodyParser as middleware to receive json
app.use(bodyParser.json());

// create the first endpoint
app.get('/blocks', (req, res) => {
  // send the chain within our blockchai instance
  res.json(bc.chain);
});

// endpoint users will use to add data to the blockchain
app.post('/mine', (req,res) => {
  // create a block using the data that the post request will make (express will make that post data into json)
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  // make sure all the chains connect with the newest mined chain
  p2pServer.syncChains();

  res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction  = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.get('/public-Key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

// start http server
app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`));
// start the websocket peer server
p2pServer.listen();
