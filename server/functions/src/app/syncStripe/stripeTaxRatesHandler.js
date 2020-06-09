export default class StripeTaxRatesHandler {
  constructor(endpoint) {
    this.endpoint = endpoint.taxRates;
  }

  map = dbTax => {
    const tax = {
      active: true,
      display_name: dbTax.display_name,
      description: dbTax.description,
      inclusive: dbTax.inclusive,
      jurisdiction: dbTax.jurisdiction,
      percentage: dbTax.sales_tax_rate,
      metadata: { externalId: String(dbTax.sales_tax_rate) },
    };
    return tax;
  };

  list = async params => {
    const objects = [];
    for await (const object of this.endpoint.list({ ...params, limit: 100 })) {
      objects.push(object);
    }
    return objects;
  };

  equal = (taxRate, stripeTaxRate) => {
    return (
      taxRate.display_name === stripeTaxRate.display_name &&
      taxRate.description === stripeTaxRate.description &&
      taxRate.active === !!stripeTaxRate.active &&
      taxRate.inclusive === !!stripeTaxRate.inclusive &&
      taxRate.jurisdiction === stripeTaxRate.jurisdiction &&
      taxRate.percentage === +stripeTaxRate.percentage &&
      taxRate.metadata.externalId === stripeTaxRate.metadata.externalId
    );
  };

  delete = async taxRate => {
    console.log(`Deactivating tax rate: ${taxRate.name} (${taxRate.id})`);
    const stripeTaxRate = await this.endpoint.update(taxRate.id, {
      active: false,
    });
    return stripeTaxRate;
  };

  create = async taxRate => {
    console.log(`Creating taxRate: ${taxRate.name} (${taxRate.id})`);
    try {
      const stripeTaxRate = await this.endpoint.create(taxRate);
      return stripeTaxRate;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  update = async taxRate => {
    console.log(`Updating taxRate: ${taxRate.display_name}`);

    const updatedTaxRate = { ...taxRate };
    delete updatedTaxRate.id;

    await this.endpoint.update(taxRate.id, {
      active: false,
    });

    const stripeTaxRate = await this.endpoint.create(updatedTaxRate);

    return stripeTaxRate;
  };
}
