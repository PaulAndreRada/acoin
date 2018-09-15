const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey  : ${this.publicKey.toString()}
      balance    : ${this.balance}`
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

    // leave if the amount exceedes balance
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceedes current balance: ${this.balance}`);
      return;
    }

    // returns transactions in the transaction pool that where created with this address/publicKey
    let transaction = transactionPool.existingTransaction(this.publicKey);
    // is there already a transaction in the transaction pool
    if(transaction){
      // update the transaction
      transaction.update(this, recipient, amount);
    } else {
      // if no transaction already exist, create a new one
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    // go from block to transactions in a loop, saving all the transactions
    // into the temporary array inside this function
    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction)
    }));

    // only return those transactions that have our public key
    // remember: wallet inputs are the objects with the information of the wallet sender (not the actual outgoing transactions)
    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

    // this is used later to find the most recent output inside the last transaction
    let startTime = 0;

    if(walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        // get the element with the highest timestammp to move to the front
        // in order to get the most recent transactions list
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );

      // get the amount out of the current wallet in the latest transaction:
      // that's the balance
      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
      // update the timestamp to the most recent transaction
      startTime = recentInputT.input.timestamp;
    }

    // add up the outputs that come after the most recent transaction, into the balance
    transactions.forEach(transaction => {
      if(transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if(output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance
  }


  static blockchainWallet() {
    /* A wallet specifically used to give out rewards    */
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;
