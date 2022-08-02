# Install
  $ yarn add -D typescript @types/node ts-node nodemon
  $ npx tsconfig.json

  $ yarn add reflect-metadata 
  
  $ yarn add apollo-server@2.21.0
  $ yarn add @apollo/gateway@0.28.1
  <!-- $ yarn add apollo-server-core@2.21.0 -->
  $ yarn add graphql@15.3.0
  $ yarn add type-graphql

  $ yarn add @apollo/federation@0.25.0

# Max version
  "dependencies": {
    "@apollo/federation": "0.33.0",
    "@apollo/gateway": "0.51.0",
    "@apollo/subgraph": "0.4.2",
    "apollo-server": "^3.10.0",
    "graphql": "15.8.0",
    "reflect-metadata": "^0.1.13",
    "type-graphql": "^1.1.1"
  },

# Note 
  - type-graphql `does` support <= graphql v15.8.0
  - But @apollo/gateway v2 `need` => graphql v16.0.0 
    => to use @apollo/gateway `v1`   
