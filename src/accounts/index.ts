import { ApolloServer } from 'apollo-server';

import User from './user';
import AccountsResolver from './resolver';
import { resolveUserReference } from './user-reference';
import { buildFederatedSchema } from '../helpers/buildFederatedSchema';


export async function listen(port: number): Promise<string> {
  const schema = await buildFederatedSchema(
    {
      resolvers: [AccountsResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ 
      authorization: req.headers.authorization ,
      res
    })
  });

  const { url } = await server.listen({ port });
  console.log(`Accounts service ready at ${url}`);

  return url;
}
