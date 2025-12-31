<script>
	import OrderItem from './OrderItem.svelte';
	import { cartItems, getTotalPrice } from '$lib/cart-state.svelte';
    import { goto } from '$app/navigation';

	let { closeModal } = $props();

    function proceedToCheckout() {
        closeModal();
        goto('/checkout');
    }
</script>

<div
	class="fixed top-0 right-0 left-0 flex h-screen w-screen items-end gap-2 rounded bg-black/60 md:items-center md:justify-center"
>
	<div
		class="flex w-full flex-col gap-8 rounded-t-3xl bg-white px-4 py-8 md:w-auto md:rounded-b-3xl"
	>
		<div><img src="/assets/images/icon-order-confirmed.svg" alt="Order confirmed" /></div>
		<div class="flex flex-col gap-2">
			<h1 class="text-4xl font-bold text-rose-900">Order Confirmed</h1>
			<p class="text-rose-500">We hope you enjoy your food!</p>
		</div>
		<div class="rounded bg-rose-50 p-2">
			<div class="flex flex-col gap-2 p-2">
				{#each cartItems as cartItem (cartItem.name)}
					<OrderItem {cartItem} />
				{/each}
			</div>
			<div></div>
		</div>
        <button 
            onclick={proceedToCheckout} 
            disabled={getTotalPrice() <= 0}
            class="bg-red rounded-full p-2 text-white"
        >
            Continue to payment {getTotalPrice().toFixed(2)} ETB
        </button>
        <button onclick={closeModal} class="text-sm text-gray-500 mt-2">Cancel Order</button>
	</div>
</div>
