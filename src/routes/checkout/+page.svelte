<script lang="ts">
    import { cartItems, getTotalPrice } from '$lib/cart-state.svelte';
    import { goto } from '$app/navigation';

    let firstName = $state('');
    let lastName = $state('');
    let email = $state('');
    let phoneNumber = $state('');

    let isLoading = $state(false);
    let errorMessage = $state<string | null>(null);

    const total = $derived(getTotalPrice());

    async function proceedToPayment() {
        isLoading = true;
        errorMessage = null;

        const paymentData = {
            items: cartItems.map(item => ({ name: item.name, quantity: item.quantity })),
            email,
            firstName,
            lastName,
            phoneNumber,
        };

        try {
            const response = await fetch('/api/chapa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();

            if (response.ok && result.checkout_url) {
                window.location.href = result.checkout_url;
            } else {
                errorMessage = result.error || 'Failed to get Chapa checkout link.';
            }

        } catch (error) {
            console.error('Payment Fetch Error:', error);
            errorMessage = 'An unexpected error occurred.';
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="container mx-auto p-4 md:p-6">
    <a href="/" class="mb-4 inline-flex items-center text-rose-900 hover:text-rose-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Menu
    </a>

    <div class="grid gap-8 md:grid-cols-2">
        <!-- User Details Form -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-xl font-semibold mb-4 text-rose-900">Contact Information</h2>
            <form class="flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); proceedToPayment(); }}>
                <div class="flex flex-col gap-1">
                    <label for="firstName" class="text-sm font-medium text-gray-700">First Name</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        bind:value={firstName} 
                        required 
                        class="rounded border-gray-300 p-2 focus:border-rose-500 focus:ring-rose-500"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="lastName" class="text-sm font-medium text-gray-700">Last Name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        bind:value={lastName} 
                        required 
                        class="rounded border-gray-300 p-2 focus:border-rose-500 focus:ring-rose-500"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="email" class="text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        bind:value={email} 
                        required 
                        class="rounded border-gray-300 p-2 focus:border-rose-500 focus:ring-rose-500"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="phoneNumber" class="text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                        type="tel" 
                        id="phoneNumber" 
                        bind:value={phoneNumber} 
                        required 
                        class="rounded border-gray-300 p-2 focus:border-rose-500 focus:ring-rose-500"
                    />
                </div>

                {#if errorMessage}
                    <p class="text-red-500 text-sm">{errorMessage}</p>
                {/if}

                <button 
                    type="submit"
                    disabled={isLoading || total <= 0}
                    class="mt-4 w-full rounded-full bg-red-600 p-3 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Processing...' : `Pay ${total.toFixed(2)} ETB`}
                </button>
            </form>
        </div>

        <!-- Order Summary -->
        <div class="bg-rose-50 p-6 rounded-lg h-fit">
            <h2 class="text-xl font-semibold mb-4 text-rose-900">Order Summary</h2>
            <div class="flex flex-col gap-4">
                {#each cartItems as item}
                    <div class="flex justify-between items-center border-b border-rose-100 pb-2">
                        <div>
                            <p class="font-medium text-rose-900">{item.name}</p>
                            <p class="text-sm text-rose-500">{item.quantity}x @ {item.price.toFixed(2)}</p>
                        </div>
                        <p class="font-semibold text-rose-900">{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                {/each}
                <div class="flex justify-between items-center pt-2 text-lg font-bold text-rose-900">
                    <span>Total</span>
                    <span>{total.toFixed(2)} ETB</span>
                </div>
            </div>
        </div>
    </div>
</div>
