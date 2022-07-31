import { Resolver, Query } from 'type-graphql';

import User from './user';
import { users } from './data';

@Resolver(User)
export default class AccountsResolver {
  @Query(() => User)
  me(): User {
    return users[0];
  }
}
