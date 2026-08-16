const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Helper to retrieve Bearer token headers for protected admin calls
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Admin Login API call
 */
export async function loginAdminAPI(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (error) {
    console.warn("[API Client] Admin login failed:", error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Fetch all properties from backend with optional type/search filter
 */
export async function fetchPropertiesAPI(type = "All", search = "") {
  try {
    const queryParams = new URLSearchParams();
    if (type && type !== "All") queryParams.append("type", type);
    if (search) queryParams.append("search", search);

    const res = await fetch(`${API_BASE_URL}/properties?${queryParams.toString()}`);
    if (!res.ok) throw new Error("API Error");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("[API Client] Backend offline or unreachable, using fallback data:", error.message);
    return null;
  }
}

/**
 * Fetch single property by slug
 */
export async function fetchPropertyBySlugAPI(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${slug}`);
    if (!res.ok) throw new Error("Property API Error");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn("[API Client] Could not fetch property details from API:", error.message);
    return null;
  }
}

/**
 * Post a new lead to backend CRM (Public)
 */
export async function createLeadAPI(leadData) {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    });
    return await res.json();
  } catch (error) {
    console.warn("[API Client] Could not post lead to API:", error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Book VIP Site Visit (Public)
 */
export async function createSiteVisitAPI(visitData) {
  try {
    const res = await fetch(`${API_BASE_URL}/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitData),
    });
    return await res.json();
  } catch (error) {
    console.warn("[API Client] Could not book visit via API:", error.message);
    return { success: false, message: error.message };
  }
}

/**
 * AI Chat Assistant query (Public)
 */
export async function sendAiChatAPI(message) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return await res.json();
  } catch (error) {
    console.warn("[API Client] Could not reach AI backend:", error.message);
    return null;
  }
}

/**
 * AI Recommendation query (Public)
 */
export async function sendAiRecommendAPI(prompt) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return await res.json();
  } catch (error) {
    console.warn("[API Client] Could not reach AI recommendation API:", error.message);
    return null;
  }
}

/**
 * CRM Leads list (Admin protected)
 */
export async function fetchLeadsAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) throw new Error("Leads API Error");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("[API Client] Could not fetch CRM leads from API:", error.message);
    return null;
  }
}

/**
 * Add New Property (Admin protected)
 */
export async function createPropertyAPI(propertyData) {
  try {
    const isFormData = propertyData instanceof FormData;
    const headers = { ...getAuthHeaders() };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      headers,
      body: isFormData ? propertyData : JSON.stringify(propertyData),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Update Property (Admin protected)
 */
export async function updatePropertyAPI(id, propertyData) {
  try {
    const isFormData = propertyData instanceof FormData;
    const headers = { ...getAuthHeaders() };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "PUT",
      headers,
      body: isFormData ? propertyData : JSON.stringify(propertyData),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Patch Property Status (Admin protected)
 */
export async function patchPropertyStatusAPI(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Upload Property Media Files (Cloudinary via Backend)
 */
export async function uploadPropertyMediaAPI(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/upload-media`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Delete Property (Admin protected)
 */
export async function deletePropertyAPI(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Update Lead Entry (Admin protected)
 */
export async function updateLeadAPI(id, leadData) {
  try {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(leadData),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Update Lead Status (Admin protected)
 */
export async function updateLeadStatusAPI(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Delete Lead (Admin protected)
 */
export async function deleteLeadAPI(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}


/**
 * Fetch Property Categories dynamically
 */
export async function fetchCategoriesAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Categories API Error');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('[API Client] Could not fetch categories from API:', error.message);
    return null;
  }
}

/**
 * Fetch Client Testimonials dynamically
 */
export async function fetchTestimonialsAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`);
    if (!res.ok) throw new Error('Testimonials API Error');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('[API Client] Could not fetch testimonials from API:', error.message);
    return null;
  }
}

/**
 * Fetch FAQ items dynamically
 */
export async function fetchFaqsAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/faqs`);
    if (!res.ok) throw new Error('FAQs API Error');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('[API Client] Could not fetch FAQs from API:', error.message);
    return null;
  }
}

/**
 * Fetch Showcase Stages dynamically
 */
export async function fetchShowcaseAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/showcase`);
    if (!res.ok) throw new Error('Showcase API Error');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('[API Client] Could not fetch showcase stages from API:', error.message);
    return null;
  }
}
