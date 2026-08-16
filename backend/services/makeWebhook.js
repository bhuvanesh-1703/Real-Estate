/**
 * Service to dispatch lead payloads safely to Make.com Custom Webhook.
 * Reads MAKE_WEBHOOK_URL from process.env.
 * Webhook failures are caught and logged without affecting main lead processing.
 */
async function sendLeadToMake(lead) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[Make Webhook] MAKE_WEBHOOK_URL is not set. Skipping webhook.');
    return false;
  }

  // Construct clean payload ensuring no undefined values
  const payload = {
    name: lead.name || "",
    email: lead.email || "",
    phone: lead.phone || "",
    property: lead.property || "",
    location: lead.location || "",
    message: lead.message || lead.query || "",
    timeline: lead.timeline || "",
    budget: lead.budget || "",
    source: lead.source || "Website Form",
    date: lead.date || "",
    time: lead.time || "",
    notes: lead.notes || ""
  };

  try {
    const fetchFn = typeof fetch === 'function' ? fetch : require('node-fetch');

    const response = await fetchFn(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`[Make Webhook] Lead sent successfully for "${payload.name}"`);
      return true;
    } else {
      console.error(`[Make Webhook] Failed to send lead: HTTP ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('[Make Webhook] Failed to send lead:', error.message || error);
    return false;
  }
}

module.exports = {
  sendLeadToMake
};
