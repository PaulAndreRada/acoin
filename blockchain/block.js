const ChainUtil = require('../chain-util');
const { DIFFICULTY , MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
      this.timestamp = timestamp;
      this.lastHash = lastHash;
      this.hash = hash;
      this.data = data;
      this.nonce = nonce;
      this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
      // this is for debugging
      // using substrings to avoid a super long hashes, we just need the beggining
      return `Block -
        Timestamp   : ${this.timestamp}
        Last Hash   : ${this.lastHash.substring(0, 10)}
        Hash        : ${this.hash.substring(0,10)}
        Nonce       : ${this.nonce}
        Difficulty  : ${this.difficulty}
        Data        : ${this.data}`;
    }

    // using static to not create a new instance of the block object when calling it
    static genesis(){
      // return a new instance of the this block class, with dummy data,
      // the dummy hash just reads first-hash
      // with an empty array for data
      return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
      /*
       To create a new block,
       Use the last blocks hash,
       and the new block's data
       to mine the creation of this new block.
       The while loop will continue to try new nonce's
       until it finds a hash that starts with the amount of
       zero's required for the DIFFICULTY contant.
      */
      let hash, timestamp;
      let { difficulty } = lastBlock;
      let nonce = 0;
      const lastHash = lastBlock.hash;

      // Mine
      do {
        // increase the nonce with every attempt
        nonce++;
        timestamp = Date.now();
        difficulty = Block.adjustDifficulty(lastBlock, timestamp);
        // in case that this is the right nonce,
        // try to create a hash with all of the blocks elements
        hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
      } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

      // return this new block
      return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    /* Hash function:
      uses timestamp, lasthash and stored data as the N that represents the hashe
    */
    static hash(timestamp, lastHash, data, nonce, difficulty){
      return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
      // assign the same variables in this block object
      const { timestamp, lastHash, data, nonce, difficulty } = block;
      // make it easier for the blockchain class
      // to give only the block as a regular input
      // to this funtions in order to generate the hash overall
      return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
      let {difficulty} = lastBlock;
      difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
      return difficulty;
    }
}

module.exports = Block;
