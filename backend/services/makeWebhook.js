/**
 * Service to dispatch lead payloads safely to Make.com Custom Webhook.
 * Authenticates via x-make-apikey header and logs errors without exposing secrets.
 */
async function sendMakeLeadWebhook(leadPayload) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  const apiKey = process.env.MAKE_WEBHOOK_API_KEY;

  if (!webhookUrl) {
    console.log('[Make.com Webhook] MAKE_WEBHOOK_URL environment variable is not defined. Skipping automation dispatch.');
    return false;
  }

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (apiKey && apiKey !== 'your_make_webhook_api_key') {
      headers['x-make-apikey'] = apiKey;
    }

    // Node 18+ has global fetch built-in
    const fetchFn = typeof fetch === 'function' ? fetch : require('node-fetch');

    console.log(`[Make.com Webhook] Dispatching lead automation event for "${leadPayload.name}"...`);

    const response = await fetchFn(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(leadPayload)
    });

    if (response.ok) {
      console.log(`[Make.com Webhook] Successfully delivered lead for "${leadPayload.name}" (HTTP ${response.status})`);
      return true;
    } else {
      console.error(`[Make.com Webhook Error] Webhook endpoint responded with status HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    // Log safe error message without printing API keys or URLs with tokens
    console.error('[Make.com Webhook Error] Could not connect to Make.com webhook:', error.message || error);
    return false;
  }
}

module.exports = {
  sendMakeLeadWebhook
};
