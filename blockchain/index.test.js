const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', ()=>{
  let bc, bc2;

  /* THIS WILL ALWAYS HAPPEN BEFORE ANY OF THE TEST */
  beforeEach(()=>{
    // start with new blockchains every time you test
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  // testing that the first block is the genesis block
  it('starts with the genesis block',() => {
      expect(bc.chain[0]).toEqual(Block.genesis());
  });

  // testing that there's a new block created with
  // with the correct data assigned to it
  it('adds a new block',()=>{
    // create the block with testable data
    const data = 'foo';
    bc.addBlock(data);
    // check that the new block has the same data
    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });

  //---------Validating the chain -------------------
  it('validates a valid chain', () => {
    // add a block to the second chain that's the same as the first chain so far
    bc2.addBlock('foo');
    // check that the chain comparison is true
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
      // currupt the genesis block of BC2
      bc2.chain[0].data = 'Bad Data';
      // check that it's no longer valid
      expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', ()=> {
    // create a block in chain 2 that's foo
    bc2.addBlock('foo');
    // change the same block in the second chain to be curropt
    bc2.chain[1].data ='Not foo';
    // check if the chain is no longer valid
    // it will not work because we will generate a hash
    // that will find it to have inconsisntent data relating to the hash
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('replaces the chain with a valid chain', () => {
    // add a longer chain - by adding a block
    bc2.addBlock('goo');
    // replace the chain, this should be valid
    bc.replaceChain(bc2.chain);
    // Check that both chains are the same
    expect(bc.chain).toEqual(bc2.chain);
  });

  it('does not replace the chain, with one of less than or equal to length', () => {
    // make our blockchain longer than the second one
    bc.addBlock('foo');
    // Pass in the smaller chain to replace, this should be invalid
    bc.replaceChain(bc2.chain);
    // Check that the chains are not equal
    expect(bc.chain).not.toEqual(bc2.chain);
  });

});
