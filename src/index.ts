import 'reflect-metadata';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';

import * as accounts from './accounts';
import * as reviews from './reviews';
import * as products from './products';
import * as inventory from './inventory';

async function bootstrap() {
  const accounts_URL = await accounts.listen(3001);
  const reviews_URL = await reviews.listen(3002);
  const products_URL = await products.listen(3003);
  const inventory_URL = await inventory.listen(3004);

  const subgraphs = [
    { name: "accounts", url: accounts_URL },
    { name: "reviews", url: reviews_URL },
    { name: "products", url: products_URL },
    { name: "inventory", url: inventory_URL },
  ];

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs,
    })
  });

  const server = new ApolloServer({
    gateway,
    // subscriptions: false,
  });

  server.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Apollo Gateway ready at ${url}`);
  });
}

bootstrap().catch(console.error);
