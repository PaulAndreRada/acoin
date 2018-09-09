class Miner {
  constructor(blockchain, transactionPool, wallet, p2pserver){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    // grab transaction from the pool
    // create a block whith those transactions
    // syncronise the chain and include the new block with those transactions
    const validTransactions = this.transactionPool.validTransactions();

    // include a reward for the miner
    // create a block consisting of validTransactions
    // synchronize chains in the peer-to-peer server
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pools

  }
}

module.exports = Miner;
