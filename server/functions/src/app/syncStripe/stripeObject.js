export class StripeObject {
  constructor(stripeAccount) {
    this.requestParams =
      stripeAccount === 'main' ? null : { stripeAccount: stripeAccount };
  }

  map = dbProd => {};

  list = async params => {
    const objects = [];
    for await (const object of this.endpoint.list(
      {
        active: true,
        limit: 100,
        ...params,
      },
      this.requestParams
    )) {
      objects.push(object);
    }
    return objects;
  };

  equal = (object, stripeObject) => {};

  delete = async object => {
    console.log(
      `Deactivating object: ${object.name} (${object.id ||
        object.metadata?.externalId})`
    );
    const stripeProduct = await this.endpoint.update(
      object.id,
      {
        active: false,
      },
      this.requestParams
    );
    return stripeProduct;
  };

  create = async object => {
    console.log(`Creating object: ${object.name} (${object.id})`);
    try {
      const stripeObject = await this.endpoint.create(
        object,
        this.requestParams
      );
      return stripeObject;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  update = async (object, updateViaDelete = false) => {
    console.log(`Updating object: ${object.name} (${object.id})`);
    let stripeObject;
    const updatedObject = { ...object };
    if (updateViaDelete) {
      // console.log(
      //   `Updating Price: ${price.metadata?.externalId} (Product Id: ${price.product})`
      // );
      delete updatedObject.id;

      await this.endpoint.update(
        object.id,
        {
          active: false,
        },
        this.requestParams
      );

      stripeObject = await this.endpoint.create(
        updatedObject,
        this.requestParams
      );
    } else {
      stripeObject = await this.endpoint.update(
        object.id,
        updatedObject,
        this.requestParams
      );
    }
    return stripeObject;
  };
}
