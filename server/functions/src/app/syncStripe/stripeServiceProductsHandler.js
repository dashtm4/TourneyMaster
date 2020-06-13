export default class StripeServiceProductsHandler {
  constructor(endpoint) {
    this.endpoint = endpoint.products;
  }

  map = dbProd => {
    const product = {
      id: dbProd.sku_id,
      name: dbProd.product_name + ': ' + dbProd.sku_name,
      type: 'service',
      active: true,
      url: dbProd.url,
      metadata: {
        externalId: dbProd.sku_id,
        event_id: dbProd.event_id,
        division_id: dbProd.division_id,
        price: +dbProd.price,
        event_startdate: dbProd.sale_startdate,
        event_enddate: dbProd.sale_enddate,
        sales_tax_rate: dbProd.sales_tax_rate,
      },
    };
    // console.log(JSON.stringify(product, null, '  '));
    return product;
  };

  list = async params => {
    const objects = [];
    for await (const object of this.endpoint.list({ ...params, limit: 100 })) {
      objects.push(object);
    }
    return objects;
  };

  equal = (product, stripeProduct) => {
    return (
      product.name === stripeProduct.name &&
      product.active === !!stripeProduct.active &&
      product.url === stripeProduct.url &&
      product.type === stripeProduct.type &&
      product.metadata.externalId === stripeProduct.metadata.externalId &&
      product.metadata.price === +stripeProduct.metadata.price &&
      product.metadata.event_id === stripeProduct.metadata.event_id &&
      product.metadata.division_id === stripeProduct.metadata.division_id &&
      product.metadata.sales_tax_rate ===
        +stripeProduct.metadata.sales_tax_rate &&
      product.metadata.event_startdate ===
        stripeProduct.metadata.event_startdate &&
      product.metadata.event_enddate === stripeProduct.metadata.event_enddate
    );
  };

  delete = async product => {
    console.log(`Deactivating product: ${product.name} (${product.id})`);
    const stripeProduct = await this.endpoint.update(product.id, {
      active: false,
    });
    return stripeProduct;
  };

  create = async product => {
    console.log(`Creating product: ${product.name} (${product.id})`);
    try {
      const stripeProduct = await this.endpoint.create(product);
      return stripeProduct;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  update = async product => {
    console.log(`Updating product: ${product.name} (${product.id})`);
    const updatedProd = { ...product };
    delete updatedProd.type;
    delete updatedProd.id;
    const stripeProduct = await this.endpoint.update(product.id, updatedProd);
    return stripeProduct;
  };
}
