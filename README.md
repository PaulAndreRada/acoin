# Acoin
A generic coin inspired by Bitcoin. In javascript. Meant to experiment with blockchains capabilities.

### Install
Download, clone or fork the Acoin repository, then run:
```npm install```


### Run a node
To run a node that instantly uses `HTTP_PORT=3001` `P2P_PORT=5001` and listens to all available peers run:

```npm run dev```

### Run Multiple nodes
Because you won't be able to test much without more than one node, use the same `npm run dev` command, but change the ports.
Although the actual port names differ based on the amount of ports you're using, here's an example of the second port.
```HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev```

### Endpoints
Because Acoin currently has no front end interface to use the currency, using the currency is easier by using an API tool like [Postman](https://www.getpostman.com/).
Here's a list of endpoints to play with:

```
Get
  /blocks  
  /transactions
  /mine-transactions
  /public-Key
  /my-balance


Post
  /transact
    PARAMS:
      recipient: <recipients public key>
      amount: <int>

  /mine-transactions

```

### Test Suite
Acoin uses [Jest](https://jestjs.io/) for testing of all it's code. Every acoin module has a `file.test.js` file that's used to
test every function created.
To run Jest test suite use:

```npm run test```


# TODO
In order to make the generic Acoin into a product concept that spans beyond just another bitcoin clone, the're 3 different areas of interest that need to be worked on, in phases. Phase one will be focused on making the currency interface both easier to use (the user facing side of the currency) and more secure (the mining side). Task to do regarding phase one:
```
Phase One: Making the standard cryptocurrency
  Interaction:
    1. Create a mining Daemon for continuous mining, without the need  for a browser.
    2. Create a wallet CLI tool, include the mining deamon in it.

  Performance:
    1. Refactor the calculateBalance function to be more efficient.
    2. Refactor the calculateBalance function to be more full-proof of all the possible mining use cases:

    > The balance calculation assumes transactions are mined right away.
    >Here's a bug that can easily happen:

    >- A sends 25 to B, then B sends 25 to A, then C mines transactions (so there are 2 transactions in transaction pool)

    >This will show improper balance for B because it won't count the transfer from A which occurred before B's Input Transaction was created.

    >In the end, A and B should both have 500 (what they started with) and C should have 550 (his mining reward). But in reality, it will show A as having 500, B with balance 475 and C with 550.

    >B's balance calculation didn't take into account A's transfer which occurred before B's Input Transaction was created.

  Security:
    1. Create a test suite with all of the penetration test possible.

  Possible:
      1. Design and create a proof of stake mining system?
```

```
Phase Two: Making it a product (beyond just a cryptocurrency)
  Interface:
    1. Create an easy to use client app for normies to interact with the currency
    2. Create an abstraction of the key and public key system to allow for the most basic possible email/password combination with a "forgot password" feature.
```
More to come on both phases.
