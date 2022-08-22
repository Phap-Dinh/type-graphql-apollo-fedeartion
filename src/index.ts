import 'reflect-metadata';
import { 
  ApolloGateway, 
  IntrospectAndCompose, 
  RemoteGraphQLDataSource, 
  GraphQLDataSourceProcessOptions 
} from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';

import * as accounts from './accounts';
import * as reviews from './reviews';
import * as products from './products';
import * as inventory from './inventory';

type MyContext = { authorization: string } 

class DataSourceWithServerId extends RemoteGraphQLDataSource {
  // custom response
  async didReceiveResponse({ response, context }: any) {
    const serverId = response.http.headers.get('Server-Id');
    if (serverId) {
      context.serverIds.push(serverId);
    }

    // get cookie from account subgraph
    // const myCookie = response.http.headers.get('set-cookie')

    return response;
  }

  // custom request
  willSendRequest({ request, context }: GraphQLDataSourceProcessOptions<MyContext>) {
    const { authorization } = (context as MyContext);
    if (authorization) {
      request?.http?.headers.set("authorization", authorization);
    }
  }
}

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
    }),
    buildService({ url }) {
      return new DataSourceWithServerId({ url });
    }
  });

  const server = new ApolloServer({
    gateway,
    // subscriptions: false,
    context: ({ req }) => ({ 
        authorization: req.headers.authorization,
        serverIds: []
        // cookie: ""
    }),
    plugins: [
      {
        requestDidStart(): any {
          return {
            willSendResponse({ context, response }: any) {
              response.http.headers.set(
                'Server-Id',
                context.serverIds.join(',')
              );
              
              // can not return cookie, only return headers
              // response.http.headers.set("Cookies", context.cookie);
            
            },
            
          };
        }
      }
    ]
  });

  server.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Apollo Gateway ready at ${url}`);
  });
}

bootstrap().catch(console.error);
