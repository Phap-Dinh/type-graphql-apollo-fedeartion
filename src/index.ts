import 'reflect-metadata';
import { 
  ApolloGateway, 
  IntrospectAndCompose, 
  RemoteGraphQLDataSource, 
  GraphQLDataSourceProcessOptions 
} from '@apollo/gateway';
import { 
  GraphQLRequestContext, 
  GraphQLRequestContextWillSendResponse, 
  GraphQLResponse, ValueOrPromise 
} from 'apollo-server-types';
import { ApolloServer } from 'apollo-server';

import * as accounts from './accounts';
import * as reviews from './reviews';
import * as products from './products';
import * as inventory from './inventory';

type MyContext = { 
  authorization: string,
  serverIds: string[],
  cookie: string,
} 

class DataSourceWithServerId extends RemoteGraphQLDataSource<MyContext> {
  // custom response
  async didReceiveResponse(
    { response, context }: Required<Pick<GraphQLRequestContext<MyContext>, "response" | "context" | "request">>
  ): Promise<GraphQLResponse> {
    
    const serverId = response?.http?.headers.get("server-id");
    if (serverId) {
      context.serverIds.push(serverId);
    }

    // get cookie from account subgraph
    const rawCookie = response?.http?.headers.get("set-cookie");
    if (rawCookie) {
      context.cookie = rawCookie;
    }

    return response;
  }

  // custom request
  willSendRequest(
    { request, context }: GraphQLDataSourceProcessOptions<MyContext>
  ): ValueOrPromise<void> {

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
        serverIds: [],
        cookie: ""
    }),
    plugins: [
      {
        requestDidStart() {
          return {
            willSendResponse(
              { context, response }: GraphQLRequestContextWillSendResponse<MyContext>
            ) {
              // return the server-id property in response's header
              response.http?.headers.set(
                "server-id",
                context.serverIds.join(",")
              );
              
              // can return cookie, only see in Network
              // to see in Application, you should use apollo-server-express and cors
              response.http?.headers.set("set-cookie", context.cookie);
            } 
          } as any;
        }
      }
    ]
  });

  server.listen({ port: 3000 }).then(({ url }) => {
    console.log(`Apollo Gateway ready at ${url}`);
  });
}

bootstrap().catch(console.error);
