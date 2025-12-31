<script lang="ts">
	import type { Product as ProductType } from '$lib/cart-state.svelte';
	let { product }: { product: ProductType } = $props();

	import { isInCart, getCartItem, addToCart, increment, decrement } from '$lib/cart-state.svelte';

	const cartItem = $derived(getCartItem(product.name));
	const inCart = $derived(isInCart(product.name));
</script>

<div class="flex flex-col justify-center gap-1">
	<div>
		<picture>
			<source media="(min-width: 600px)" srcset={product.image.tablet} />
			<source media="(min-width: 900px)" srcset={product.image.desktop} />
			<img
				class="rounded-lg border-2 {inCart ? 'border-red' : 'border-transparent'}"
				src={product.image.mobile}
				alt="{product.name} image"
			/>
		</picture>
	</div>
	{#if inCart}
		<div
			class="bg-red -mt-5 flex items-center justify-between gap-7 self-center rounded-full px-3 py-1"
		>
			<button onclick={() => decrement(product.name)}>
				<img
					src="./assets/images/icon-decrement-quantity.svg"
					alt=""
					class="rounded-full border border-white px-1 py-2"
				/>
			</button>
			<p class="text-white">{cartItem?.quantity}</p>
			<button onclick={() => increment(product.name)}>
				<img
					src="./assets/images/icon-increment-quantity.svg"
					alt=""
					class="rounded-full border border-white p-1"
				/>
			</button>
		</div>
	{:else}
		<button
			onclick={() => addToCart(product)}
			class="-mt-5 flex gap-2 self-center rounded-full border border-rose-300 bg-white px-3 py-1"
		>
			<img src="./assets/images/icon-add-to-cart.svg" alt="" />Add to cart</button
		>
	{/if}
	<div>
		<p class="text-rose-400">{product.category}</p>
		<h2 class="text-rose-900">{product.name}</h2>
		<p class="text-red">${product.price}</p>
	</div>
</div>
