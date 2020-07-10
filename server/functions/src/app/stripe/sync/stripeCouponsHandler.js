import { StripeObject } from './stripeObject.js';

export default class StripeCouponsHandler extends StripeObject {
  constructor(endpoint, stripeAccount) {
    super(stripeAccount);
    this.endpoint = endpoint.coupons;
  }

  map = dbCoupon => {
    const tax = {
      name: dbCoupon.name,
      duration: dbCoupon.duration,
      percent_off: dbCoupon.percent_off,
      metadata: { externalId: String(dbCoupon.percent_off) },
    };
    return tax;
  };

  equal = (coupon, stripeCoupon) => {
    return (
      coupon.name === stripeCoupon.name &&
      coupon.duration === stripeCoupon.duration &&
      coupon.percent_off === +stripeCoupon.percent_off &&
      coupon.metadata.externalId === stripeCoupon.metadata.externalId
    );
  };

  async delete(object) {
    console.log(
      `Deactivating object: ${object.name} (${
        object.id || object.metadata?.externalId
      })`
    );
    const deletedCoupon = await this.endpoint.del(
      object.id,
      this.requestParams
    );
    return deletedCoupon;
  }

  update = async coupon => {
    return await super.update(coupon, true);
  };
}
