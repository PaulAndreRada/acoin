const Block = require('./block');

class Blockchain {
  constructor(){
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    // grab the last block in the chain and add the data
    const block = Block.mineBlock(this.chain[this.chain.length-1], data);
    this.chain.push(block);

    return block;
  }

  // returns boolean if valid chain or not
  isValidChain(chain){
    // return false if the incoming chain is valid via the genesis blocks
    // use stringify to make sure js recognises the comparison
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    //run trough the inputed chain
    for(let i=1; i<chain.length; i++){
      // grab the block in this iter
      const block = chain[i];
      // grab the previous block before that block in this iter
      const lastBlock = chain[i-1];

      // if the new blocks hash value does not equal the lastblocks hash
      // OR
      // if the block's hash property does not  equal our generated block (inside the class)
      // we know that this chain is invalid
      if(block.lastHash !== lastBlock.hash ||
         block.hash !== Block.blockHash(block)) {
        return false
      }
    }
    return true;
  }

  replaceChain(newChain){
    if(newChain.length <= this.chain.length){
      // check if the new chain is longer than our chain
      // if not, escape this function
       console.log('Received chain is not longer than the current chain.');
       return
    } else if (!this.isValidChain(newChain)){
      // if the chain is not valid, escape the function - there's been curroption in that chain
      console.log('The received chain is not valid');
      return;
    }

    console.log('replacing blockchain with the new chain');
    this.chain = newChain;
  }
}

module.exports = Blockchain;
