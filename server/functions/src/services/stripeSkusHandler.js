import config from '../config.js';

export default class StripeSkusHandler {
	constructor(endpoint) {
		this.endpoint = endpoint.skus;
	}

	map = sku => {
		const stripeSku = {
			id: sku.sku_id,
			currency: config.DEFAULT_CURRENCY,
			inventory: {
				type: config.DEFAULT_SKU_INVENTORY_TYPE,
				quantity: config.DEFAULT_SKU_INVENTORY_QUANTITY
			},
			metadata: {
				externalId: sku.sku_id,
				name: sku.sku_name,
				division_spec_fee: +sku.division_spec_fee,
				final_division_fee: +sku.final_division_fee
			},
			product: sku.product_id,
			active: true,
			price: +sku.price * 100
		};
		return stripeSku;
	};

	list = async () => {
		const objects = [];
		for await (const object of this.endpoint.list({
			limit: 100
		})) {
			objects.push(object);
		}
		return objects;
	};

	equal = (sku, stripeSku) => {
		return (
			sku.currency === stripeSku.currency &&
			sku.active === stripeSku.active &&
			sku.product === stripeSku.product &&
			sku.inventory.type === stripeSku.inventory.type &&
			sku.metadata.externalId === stripeSku.metadata.externalId &&
			sku.metadata.name === stripeSku.metadata.name &&
			sku.metadata.division_spec_fee ===
				+stripeSku.metadata.division_spec_fee &&
			sku.metadata.final_division_fee ===
				+stripeSku.metadata.final_division_fee &&
			sku.price === +stripeSku.price
		);
	};

	delete = async sku => {
		console.log(`Deactivating SKU: ${sku.name} (${sku.product})`);
		const stripeSku = await this.endpoint.update(sku.id, {
			active: false
		});
		return stripeSku;
	};

	create = async sku => {
		console.log(`Creating SKU: ${sku.id} (Product Id: ${sku.product})`);
		const stripeSku = await this.endpoint.create(sku);
		return stripeSku;
	};

	update = async sku => {
		console.log(`Updating SKU: ${sku.id} (Product Id: ${sku.product})`);
		const updatedSku = { ...sku };
		delete updatedSku.id;
		const stripeSku = await this.endpoint.update(sku.id, updatedSku);
		return stripeSku;
	};
}
