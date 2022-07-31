import { Resolver, FieldResolver, Directive, Root } from 'type-graphql';

import Product from './product';

@Resolver(Product)
export default class InventoryResolver {
  @Directive(`@requires(fields: "price weight")`)
  @FieldResolver(() => Number)
  async shippingEstimate(@Root() product: Product): Promise<number> {
    // free for expensive items
    if (product.price > 1000) {
      return 0;
    }

    // estimate is based on weight
    return product.weight * 0.5;
  }
}
