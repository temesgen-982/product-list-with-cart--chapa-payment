<script>
	import { removeFromCart } from '$lib/cart-state.svelte';
	let { cartItem } = $props();
</script>

<div class="flex items-center justify-between border-b border-rose-200 py-2">
	<div>
		<h2 class="text-rose-900">{cartItem.name}</h2>
		<div class="flex gap-2">
			<p class="text-red">{cartItem.quantity}x</p>
			<p>
				<span class="text-rose-400">@ ${cartItem.price}</span>
				<span class="text-rose-500">${cartItem.quantity * cartItem.price}.00</span>
			</p>
		</div>
	</div>
	<button
		class="rounded-full border border-rose-300 p-1"
		onclick={() => removeFromCart(cartItem.name)}
	>
		<img src="/assets/images/icon-remove-item.svg" alt="remove item" />
	</button>
</div>
