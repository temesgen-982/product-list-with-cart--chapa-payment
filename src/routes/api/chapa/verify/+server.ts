import { CHAPA_SECRET_KEY } from '$env/static/private';
import { getTransaction, updateTransactionStatus } from '$lib/server/store';

export async function GET({ url }) {

    const tx_ref = url.searchParams.get('tx_ref');

    if (!tx_ref) {
        return new Response('Missing transaction reference', { status: 400 });
    }

    // 1. Check local store first
    const transaction = getTransaction(tx_ref);
    if (transaction && transaction.status === 'success') {
        console.log(`[VERIFY] Transaction ${tx_ref} already marked as success in store.`);
        return new Response(JSON.stringify({ message: "Payment verified (cached)." }), { status: 200 });
    }

    const chapaVerifyUrl = `https://api.chapa.co/v1/transaction/verify/${tx_ref}`;

    try {
        const response = await fetch(chapaVerifyUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            },
        });

        const result = await response.json();

        if (result.status === 'success' && result.data && result.data.status === 'success') {
            // database update
            console.log(`VERIFICATION SUCCESS for TX: ${tx_ref}. Amount: ${result.data.amount}`);

            // Update store if not already updated
            updateTransactionStatus(tx_ref, 'success');

            return new Response(JSON.stringify({ status: 'success', message: "Verification received and processed." }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } else {
            // failed/pending status
            const chapaStatus = result.data?.status || 'unknown';
            console.warn(`VERIFICATION PENDING/FAILED for TX: ${tx_ref}. Chapa Status: ${chapaStatus}`);
            
            // Only mark as failed if explicitly failed, otherwise keep as pending
            if (chapaStatus === 'failed') {
                updateTransactionStatus(tx_ref, 'failed');
            }
            
            return new Response(JSON.stringify({ 
                status: chapaStatus, 
                message: result.message || 'Verification failed or pending.' 
            }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (err) {
        console.error('Verification Handler Server Error:', err);
        return new Response('Server error during verification.', { status: 500 });
    }
}
