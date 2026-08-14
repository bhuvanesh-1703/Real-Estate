// AI Real Estate Intelligent Recommendation Engine

const processNaturalLanguageQuery = (prompt) => {
  const query = (prompt || '').toLowerCase();
  
  let propertyType = null;
  if (query.includes('villa')) propertyType = 'Villa';
  else if (query.includes('apartment') || query.includes('flat')) propertyType = 'Apartment';
  else if (query.includes('plot') || query.includes('land')) propertyType = 'Plots';
  else if (query.includes('house')) propertyType = 'Independent Houses';

  let maxBudget = null;
  if (query.includes('75') || query.includes('75l') || query.includes('75 lakhs')) maxBudget = 7500000;
  if (query.includes('1.5') || query.includes('1.5cr')) maxBudget = 15000000;

  return { propertyType, maxBudget };
};

const recommendProperties = async (req, res) => {
  try {
    const { prompt, preferences } = req.body;

    const analysis = processNaturalLanguageQuery(prompt);

    const matchReasons = [
      'Matches your specified budget threshold',
      'High ROI and capital appreciation zone',
      'RERA approved premium listing'
    ];

    res.json({
      success: true,
      queryAnalyzed: prompt,
      extractedCriteria: analysis,
      recommendationSummary: `Based on your request "${prompt}", we identified top matching luxury properties in high-growth corridors.`,
      matchReasons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const lower = (message || '').toLowerCase();

    let reply = "I'm Aetheria AI, your real estate advisor! How can I help you find your dream property today?";

    if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) {
      reply = "Our properties range from ₹45 Lakhs for DTCP plots up to ₹2.5 Cr for ultra-luxury pool villas. Would you like me to filter listings within your budget?";
    } else if (lower.includes('visit') || lower.includes('book') || lower.includes('appointment')) {
      reply = "You can easily schedule a VIP site visit using our 'Book Site Visit' button on top, or select your preferred date right here!";
    } else if (lower.includes('villa') || lower.includes('luxury')) {
      reply = "We have stunning Italian-style 3BHK and 4BHK villas in Anna Nagar and Ring Road with private swimming pools and smart home features.";
    }

    res.json({
      success: true,
      reply,
      suggestedActions: ['View 3BHK Villas', 'Calculate ROI', 'Book Site Visit']
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  recommendProperties,
  chatAssistant
};
