<script>
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    const statusParam = page.url.searchParams.get('status'); // Chapa uses 'status' or 'payment'?
    const tx_ref = page.url.searchParams.get('tx_ref');

    let message = $state('Checking transaction status...');
    let isVerifying = $state(true);
    let currentStatus = $state('pending'); // 'pending', 'success', 'failed'

    onMount(async () => {
        if (!tx_ref) {
            message = 'Missing transaction reference.';
            isVerifying = false;
            currentStatus = 'failed';
            return;
        }

        try {
            const response = await fetch(`/api/chapa/verify?tx_ref=${tx_ref}`);
            const result = await response.json();

            if (result.status === 'success') {
                message = 'Payment successful! We are confirming your order now.';
                currentStatus = 'success';
            } else if (result.status === 'failed') {
                message = 'Payment failed. Please try again or contact support.';
                currentStatus = 'failed';
            } else {
                message = `Transaction ${result.status || 'pending'}. Please wait a moment.`;
                currentStatus = 'pending';
            }
        } catch (error) {
            console.error('Verification error:', error);
            message = 'There was an error verifying your payment. Please contact support.';
            currentStatus = 'failed';
        } finally {
            isVerifying = false;
        }
    });

</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-rose-50/30">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-rose-100 transition-all">
        
        {#if isVerifying}
            <div class="flex flex-col items-center gap-4 py-8">
                <div class="w-16 h-16 border-4 border-rose-200 border-t-red-600 rounded-full animate-spin"></div>
                <p class="text-rose-900 font-medium">Verifying your payment...</p>
            </div>
        {:else}
            <div class="mb-6 flex justify-center">
                {#if currentStatus === 'success'}
                    <img src="/assets/images/success.svg" alt="Success" class="w-24 h-24 object-contain" />
                {:else if currentStatus === 'failed'}
                    <img src="/assets/images/failure.svg" alt="Failure" class="w-24 h-24 object-contain" />
                {:else}
                    <div class="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-yellow-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                {/if}
            </div>

            <h1 class="text-2xl font-bold mb-4 {currentStatus === 'success' ? 'text-green-600' : currentStatus === 'failed' ? 'text-red-600' : 'text-rose-900'}">
                {currentStatus === 'success' ? 'Thank You!' : currentStatus === 'failed' ? 'Payment Issue' : 'Processing'}
            </h1>
            
            <p class="text-lg mb-6 text-gray-700 leading-relaxed">{message}</p>

            {#if tx_ref}
                <div class="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100">
                    <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Transaction Reference</p>
                    <p class="text-sm font-mono text-gray-600 break-all">{tx_ref}</p>
                </div>
            {/if}
        {/if}

        <div class="space-y-4">
            <a href="/" class="block w-full rounded-full bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 active:scale-95 transition-all shadow-md">
                Go back to Menu
            </a>
            
            <p class="text-sm text-gray-400">
                You may close this window. A confirmation will be sent to your email.
            </p>
        </div>
    </div>
</div>
