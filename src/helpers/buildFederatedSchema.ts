import gql from 'graphql-tag';
import { specifiedDirectives } from 'graphql';
import federationDirectives from '@apollo/federation/dist/directives';
import { addResolversToSchema, GraphQLResolverMap } from 'apollo-graphql';
import { buildSchema, BuildSchemaOptions, createResolversMap } from 'type-graphql';
import {
  printSchema,
  buildFederatedSchema as buildApolloFederationSchema,
} from '@apollo/federation';

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, "skipCheck">,
  referenceResolvers?: GraphQLResolverMap<any>,
) {
  const schema = await buildSchema({
    ...options,
    directives: [...specifiedDirectives, ...federationDirectives, ...(options.directives || [])],
    skipCheck: true,
  });

  const federatedSchema = buildApolloFederationSchema({
    typeDefs: gql(printSchema(schema)),
    resolvers: createResolversMap(schema) as any,
  });

  if (referenceResolvers) {
    addResolversToSchema(federatedSchema, referenceResolvers);
  }
  return federatedSchema;
}
