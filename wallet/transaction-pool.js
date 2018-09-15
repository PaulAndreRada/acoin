const Transaction = require('./transaction')

class TransactionPool {
  constructor() {
    this.transactions = new Array();
  }

  updateOrAddTransaction(transaction) {
    /* defines weather a transaction in the pool needs to be added or updated (if it already exist) */

    // find the transaction with the same ID
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    // if the transactionWithId exist
    if(transactionWithId) {
      // find the index of this current transaction
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address){
    // return a transaction from the pool that was created with this address
    return this.transactions.find(t => t.input.address === address);
  }

  validTransactions() {
    // Filter out any transactions that have been tampered with
    return this.transactions.filter(transaction => {
      // Do any transactions exceed their wallet amounts?
      // note: remember that a transaction can have multiple transactions
      // Do this by summing up the total "amount" of each object using the reduce method
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);
      // is there an invalid transaction in here? - then exit
      if (transaction.input.amount !== outputTotal) {
        console.log(`invalid transaction from ${transaction.input.address}`);
        return;
      }
      // verify all signitures - make sure it has not been tampered - then exit
      if(!Transaction.verifyTransaction(transaction)){
        console.log(`Invalid siganture from ${transaction.input.address}.`);
        return;
      }
      // it passed
      return transaction;
    });
  }

  clear() {
    this.transactions = [];
  }
}


module.exports = TransactionPool;
