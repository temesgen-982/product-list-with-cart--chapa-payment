<script>
	import CartItem from './CartItem.svelte';
	import { cartItems, getTotalPrice, getTotalQuantity } from '$lib/cart-state.svelte';

	let { showModal } = $props();
</script>

<div class="m-2 flex flex-col gap-2 rounded bg-white p-2 md:p-8">
	<h1 class="text-red text-2xl">Your Cart ({getTotalQuantity()})</h1>
	{#if cartItems.length}
		<div class="flex flex-col gap-2">
			{#each cartItems as cartItem (cartItem.name)}
				<CartItem {cartItem} />
			{/each}
		</div>
		<div class="flex justify-between">
			<h2>Order Total</h2>
			<p class="text-2xl">{getTotalPrice().toFixed(2)}</p>
		</div>
		<div class="m-2 flex items-center bg-rose-50 p-2">
			<img src="/assets/images/icon-carbon-neutral.svg" alt="carbon free" />
			<p>This is a <span class="font-bold">carbon free</span> delivery</p>
		</div>
		<button onclick={showModal} class="bg-red rounded-full p-2 text-white">Confirm Order</button>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<img src="/assets/images/illustration-empty-cart.svg" alt="cart is empty" />
			<p class="text-rose-900">Your added items will appear here</p>
		</div>
	{/if}
</div>
