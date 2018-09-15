const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
  let tp, wallet, transaction, bc;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction('r4nd-4dr355',30, bc, tp);
  });

  it('adds a transaction to the pool',() => {
    expect(tp.transactions.find(t => t.id === transaction.id )).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    tp.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
  });

  it('clears transactions', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    /* taking the valid transactions array and adding corrupt transactions to each
    // even numbered (just to get half) transaction allows us to test the valid transactions method */
    let validTransactions;

    beforeEach(() => {
      /* every iteration, create a wallet and a transaction with that wallet
      // in order to test both valid and invalid transactions */
      validTransactions = [...tp.transactions];
      for(let i=0; i<6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr335', 30, bc, tp);
        if (i%2==0) {
          transaction.input.amount = 99999
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transactions', () => {
      expect(tp.validTransactions()).toEqual(validTransactions);

    });
  });
});
