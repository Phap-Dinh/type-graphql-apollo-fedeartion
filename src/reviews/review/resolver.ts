import { Resolver, FieldResolver } from 'type-graphql';

import Review from './review';
import { reviews } from './data';

@Resolver(Review)
export default class ReviewsResolver {
  @FieldResolver(() => [Review])
  async reviews(): Promise<Review[]> {
    return reviews;
  }
}
