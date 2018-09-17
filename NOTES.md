
3 node test: success

start the first node:
npm run dev

others:
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev


TODO:
  -Make the CalculateBalance endpoint
    -test it


note: rember to connect the peers when you have more of them
    command: HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
