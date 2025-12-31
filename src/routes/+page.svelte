<script lang="ts">
	import Products from '$lib/Products.svelte';
	import Cart from '$lib/Cart.svelte';
	import OrderDialog from '$lib/OrderDialog.svelte';

	import type { Product } from '$lib/cart-state.svelte';

	let { data } = $props();
	let products = $derived(data.items);

	import { cartItems } from '$lib/cart-state.svelte';

	// show order confirmation modal
	let showOrderModal = $state(false);

	function showModal() {
		showOrderModal = !showOrderModal;
	}

	function closeModal() {
		showOrderModal = !showOrderModal;
	}

</script>

<main class="bg-rose-50 md:grid md:grid-cols-[5fr_2fr]">
	<Products {products} />
	<Cart {showModal} />
	{#if showOrderModal}
		<OrderDialog {closeModal} />
	{/if}
</main>
