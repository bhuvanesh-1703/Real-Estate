const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all properties from backend with optional type/search filter
 */
export async function fetchPropertiesAPI(type = 'All', search = '') {
  try {
    const queryParams = new URLSearchParams();
    if (type && type !== 'All') queryParams.append('type', type);
    if (search) queryParams.append('search', search);

    const res = await fetch(`${API_BASE_URL}/properties?${queryParams.toString()}`);
    if (!res.ok) throw new Error('API Error');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('[API Client] Backend offline or unreachable, using fallback data:', error.message);
    return null;
  }
}

/**
 * Fetch single property by slug
 */
export async function fetchPropertyBySlugAPI(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${slug}`);
    if (!res.ok) throw new Error('Property API Error');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('[API Client] Could not fetch property details from API:', error.message);
    return null;
  }
}

/**
 * Post a new lead to backend CRM
 */
export async function createLeadAPI(leadData) {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return await res.json();
  } catch (error) {
    console.warn('[API Client] Could not post lead to API:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Book VIP Site Visit
 */
export async function createSiteVisitAPI(visitData) {
  try {
    const res = await fetch(`${API_BASE_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData)
    });
    return await res.json();
  } catch (error) {
    console.warn('[API Client] Could not book visit via API:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * AI Chat Assistant query
 */
export async function sendAiChatAPI(message) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await res.json();
  } catch (error) {
    console.warn('[API Client] Could not reach AI backend:', error.message);
    return null;
  }
}

/**
 * AI Recommendation query
 */
export async function sendAiRecommendAPI(prompt) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  } catch (error) {
    console.warn('[API Client] Could not reach AI recommendation API:', error.message);
    return null;
  }
}

/**
 * CRM Leads list (for Admin)
 */
export async function fetchLeadsAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`);
    if (!res.ok) throw new Error('Leads API Error');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('[API Client] Could not fetch CRM leads from API:', error.message);
    return null;
  }
}

/**
 * Add New Property (for Admin)
 */
export async function createPropertyAPI(propertyData) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}
