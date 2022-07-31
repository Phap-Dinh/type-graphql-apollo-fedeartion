import Product from './product';
import { inventory } from './data';

export async function resolveProductReference(
  reference: Pick<Product, "upc">,
): Promise<Product | undefined> {
  const found = inventory.find(i => i.upc === reference.upc);

  if (!found) {
    return;
  }

  return Object.assign(new Product(), {
    ...reference,
    ...found,
  });
}
