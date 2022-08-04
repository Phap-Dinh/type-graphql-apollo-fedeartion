import { Resolver, Query, Mutation, Arg, InputType, Field, Ctx } from 'type-graphql';

import User from './user';
import { users } from './data';
import { MyContext } from './my-context'

@InputType()
class UserInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  birthDate?: string;

  @Field()
  username: string;
}

@Resolver(User)
export default class AccountsResolver {
  @Query(() => User, { nullable: true })
  me(
    @Ctx() { authorization }: MyContext
  ) {
    const user = users.find(user => user.id === authorization);
    if (!user) {
      return null;
    }

    return user;
  }

  @Query(() => [User!]!)
  users() {
    return users;
  }

  @Mutation(() => User, { nullable: true })
  createUser(
    @Arg('inputs') inputs: UserInput
  ) {
    const existUser = users.find(user => user.id === inputs.id);
    if (existUser) {
      return null;
    }

    users.push(inputs);

    return inputs;
  }
}
