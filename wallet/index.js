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

  createTransaction(recipient, amount, transactionPool) {
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
}

module.exports = Wallet;
