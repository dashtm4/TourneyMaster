export default class StripeProductsHandler {
	constructor(endpoint) {
		this.endpoint = endpoint.products;
	}

	map = dbProd => {
		const product = {
			id: dbProd.product_id,
			name: dbProd.product_name,
			type: 'good',
			shippable: false,
			active: true,
			url: dbProd.url,
			description: dbProd.description,
			metadata: {
				externalId: dbProd.product_id,
				price: +dbProd.price,
				event_id: dbProd.event_id,
				event_startdate: dbProd.sale_startdate,
				event_enddate: dbProd.sale_enddate
			}
		};
		// console.log(JSON.stringify(product, null, '  '));
		return product;
	};

	list = async () => {
		const objects = [];
		for await (const object of this.endpoint.list({ limit: 100 })) {
			objects.push(object);
		}
		return objects;
	};

	equal = (product, stripeProduct) => {
		return (
			product.name === stripeProduct.name &&
			product.active === !!stripeProduct.active &&
			product.description === stripeProduct.description &&
			product.url === stripeProduct.url &&
			product.shippable === !!stripeProduct.shippable &&
			product.type === stripeProduct.type &&
			product.metadata.externalId === stripeProduct.metadata.externalId &&
			product.metadata.price === +stripeProduct.metadata.price
		);
	};

	delete = async product => {
		console.log(`Deactivating product: ${product.name} (${product.id})`);
		const stripeProduct = await this.endpoint.update(product.id, {
			active: false
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
