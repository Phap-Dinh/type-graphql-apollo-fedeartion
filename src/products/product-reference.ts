import Product from './product';
import { products } from './data';

export async function resolveProductReference(
  reference: Pick<Product, "upc">,
): Promise<Product | undefined> {
  return products.find(p => p.upc === reference.upc);
}
