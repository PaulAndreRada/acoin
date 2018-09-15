const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor(){
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
  // takes the senders output object and the transaction object
  // and uses it to update the transaction with another output(trasaction)
  // in order to prevent identical/repeated transaction properties from clogging the chain

    // Returns the output object that matches the addess of the transaction
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    // make sure the current balance (after the other transactions in this transaction objects have been accounted for)
    // don't exceed the balance
    if(amount > senderOutput.amount){
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    // take out the amount being sent from the senders balance
    // then add it to the outputs object
    // then resign this transaction, because the original siganture
    // is not valid anymore
    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    /* Helper transaction function:
      generates a transaction based on given outputs.
      Outputs: a transaction object. */
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) {

    // break the function if the account balance is less
    // than the transaction is sending
    if(amount > senderWallet.balance){
      console.log(`${amount} exceeds balance`);
      return;
    }

    return Transaction.transactionWithOutputs( senderWallet,
      [{
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        {
          amount,
          address: recipient
      }]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    // creates a transaction for the miner reward
    return Transaction.transactionWithOutputs(blockchainWallet, [{
      amount: MINING_REWARD, address: minerWallet.publicKey
    }]);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp : Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
