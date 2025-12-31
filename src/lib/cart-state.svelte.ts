export interface Product {
	image: {
		mobile: string;
		tablet: string;
		desktop: string;
		thumbnail: string;
	};
	name: string;
	category: string;
	price: number;
}

export interface CartItem {
	name: string;
	price: number;
	quantity: number;
	thumbnail: string;
}

export const cartItems = $state<CartItem[]>([]);

const totalQuantityDerived = $derived(cartItems.reduce((total, item) => total + item.quantity, 0));
const totalPriceDerived = $derived(cartItems.reduce((total, item) => total + item.price * item.quantity, 0));

export const getTotalQuantity = () => totalQuantityDerived;
export const getTotalPrice = () => totalPriceDerived;

export function getCartItem(productName: string) {
	return cartItems.find((item) => item.name === productName);
}

export function isInCart(productName: string) {
	return cartItems.some((item) => item.name === productName);
}

// add a product to the cart
export function addToCart(product: Product) {
	const existingItem = getCartItem(product.name);

	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cartItems.push({
			name: product.name,
			price: product.price,
			quantity: 1,
			thumbnail: product.image.thumbnail
		});
	}
}
// remove a product from the cart
export function removeFromCart(productName: string) {
	const index = cartItems.findIndex((item) => item.name == productName);
	if (index > -1) {
		cartItems.splice(index, 1);
	}
}

// increment quantity of a product in the cart
export function increment(productName: string) {
	const item = getCartItem(productName);
	if (item) {
		item.quantity += 1;
	}
}

// decrements quantity
export function decrement(productName: string) {
	const item = getCartItem(productName);
	if (item) {
		if (item.quantity > 1) {
			item.quantity -= 1;
		} else {
			removeFromCart(productName);
		}
	}
}

// clear all products
export function clearCart() {
	cartItems.length = 0;
}

