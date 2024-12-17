const axios = require("axios");
const { fetchDateRangeDatagenai } = require("./genaidata");
require('dotenv').config();

// Cache for storing fetched data and AI responses
class ExpiringCache {
  constructor(defaultTTL = 60 * 60 * 1000) { // 1 hour default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if the cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  // Add has method to check if key exists and is not expired
  has(key) {
    const cached = this.cache.get(key);
    
    if (!cached) return false;
    
    // Check if the cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

// Create cache instance
const cache = new ExpiringCache(24 * 60 * 60 * 1000); // 24 hours default TTL

function calculateEmissionImpact(emissionsData) {
  const impactSummary = {
    totalEmissions: {
      CO2: 0,
      CO: 0,
      H2S: 0,
      NOx: 0
    },
    categories: {
      electricity: { count: 0, emissions: {} },
      fuelCombustion: { count: 0, emissions: {} },
      shipping: { count: 0, emissions: {} },
      explosion: { count: 0, emissions: {} }
    },
    impactLevel: 'Low'
  };

  // Process each category
  ['electricity', 'fuelCombustion', 'shipping', 'explosion'].forEach(category => {
    const categoryData = emissionsData[category] || {};
    
    // Determine how to process based on category
    impactSummary.categories[category].count = Object.keys(categoryData).length;

    Object.values(categoryData).forEach(entry => {
      try {
        // Specific parsing for each category
        if (category === 'electricity') {
          // Handle potential Map structure for 'result'
          const result = entry.result instanceof Map ? Object.fromEntries(entry.result) : entry.result;

          // Parse electricity emissions
          if (result?.CO2) {
            const co2Value = parseFloat(result.CO2.value); // Convert kg to tons
            if (!isNaN(co2Value)) {
              impactSummary.totalEmissions.CO2 += co2Value;
              impactSummary.categories.electricity.emissions.CO2 =
              (impactSummary.categories.electricity.emissions.CO2 || 0) + co2Value;;
            }
          }
        }

        
        else if (category === 'fuelCombustion') {
          // Handle potential Map structure for 'result'
          const result = entry.result instanceof Map ? Object.fromEntries(entry.result) : entry.result;

          // Parse fuel combustion emissions
          if (result) {
            const emissionTypes = ['CO2', 'nitrousOxideCO2e', 'methaneCO2e', 'totalDirectCO2e', 'indirectCO2e', 'lifeCycleCO2e'];
            
            emissionTypes.forEach(type => {
              if (result[type]?.value !== undefined) {
                const value = parseFloat(result[type].value);
                if (!isNaN(value)) {
                  if (type === 'CO2') {
                    impactSummary.totalEmissions.CO2 += value;
                    impactSummary.categories.fuelCombustion.emissions.CO2 = 
                      (impactSummary.categories.fuelCombustion.emissions.CO2 || 0) + value;
                  }
                }
              }
            });
          }
        }
        else if (category === 'shipping') {
          // Handle potential Map structure for 'result'
          const result = entry.result instanceof Map ? Object.fromEntries(entry.result) : entry.result;

          // Parse shipping emissions
          if (result?.carbonEmissions) {
            const co2Value = parseFloat(result.carbonEmissions.kilograms);
            if (!isNaN(co2Value)) {
              impactSummary.totalEmissions.CO2 += co2Value;
              impactSummary.categories.shipping.emissions.CO2 = 
                (impactSummary.categories.shipping.emissions.CO2 || 0) + co2Value;
            }
          }
        } 
        else if (category === 'explosion' && entry.emissions) {
          const emissionTypes = ['CO2', 'CO', 'H2S', 'NOx'];
          emissionTypes.forEach(type => {
            if (entry.emissions[type]) {
              const value = parseFloat(entry.emissions[type].replace(' kg', ''));
              if (!isNaN(value)) {
                impactSummary.totalEmissions[type] += value;
                impactSummary.categories.explosion.emissions[type] = 
                  (impactSummary.categories.explosion.emissions[type] || 0) + value;
              }
            }
          });
        }
      } catch (error) {
        console.error(`Error processing ${category} entry:`, error);
      }
    });
  });

  // Determine impact level
  const totalScore = 
    impactSummary.totalEmissions.CO2 / 10000 +
    impactSummary.totalEmissions.CO / 500 +
    impactSummary.totalEmissions.H2S / 100 +
    impactSummary.totalEmissions.NOx / 200;

  impactSummary.impactLevel = 
    totalScore > 10 ? 'Critical' : 
    totalScore > 5 ? 'High' : 
    totalScore > 2 ? 'Moderate' : 'Low';

  return impactSummary;
}


exports.analyzeEmissionsWithGenAI = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start and end dates are required." });
  }

  try {
    const cacheKey = `${startDate}-${endDate}`;

    // Check if data is already cached
    if (cache.has(cacheKey)) {
      const cachedResponse = cache.get(cacheKey);
      return res.json(cachedResponse);
    }

    // Fetch data for the given date range
    const emissionsData = await fetchDateRangeDatagenai({ params: { startDate, endDate } });
    console.log("Fetched Emissions Data:", emissionsData);

    // Calculate emission impact
    const emissionImpact = calculateEmissionImpact(emissionsData);

    // Process each category: electricity, fuelCombustion, shipping, explosion
    /* ["electricity", "fuelCombustion", "shipping", "explosion"].forEach((category) => {
      impactfulData[category] = emissionsData[category]?.map((entry) => {
        // Add explosion data structure if category is "explosion"
        if (category === "explosion") {
          return {
            date: entry.createdAt,
            explosiveType: entry.explosiveType,
            amount: entry.amount,
            emissions: entry.emissions,
          };
        } else {
          return {
            date: entry.createdAt,
            keyEmissions: entry.result,
          };
        }
      });
    }); */

    //console.log("Impactful Data Sent to AI:", impactfulData);

    // Define the thresholds and response categories for each emission type
    /* const emissionThresholds = {
      CO2: {
        low: 1000,
        moderate: 10000,
        high: 100000,
      },
      CO: {
        low: 100,
        high: 1000,
      },
      H2S: {
        low: 100,
        high: 500,
      },
    }; */

    // Prepare the prompt for Cohere AI to generate a "blame-based" response
    const prompt = `
    You are an AI environmental forensics expert tasked with analyzing emissions data from ${startDate} to ${endDate}. Your goal is to produce a scientifically accurate and precise environmental impact report, grounded in the provided data and directly attributing harm to specific emission sources.
 
     **Emission Impact Summary:**
     - Impact Level: ${emissionImpact.impactLevel}
     - Total Emissions:
       * CO2: ${(emissionImpact.totalEmissions.CO2/1000).toFixed(2)} tons
       * CO: ${(emissionImpact.totalEmissions.CO/1000).toFixed(2)} tons
       * H2S: ${(emissionImpact.totalEmissions.H2S/1000).toFixed(2)} tons
       * NOx: ${(emissionImpact.totalEmissions.NOx/1000).toFixed(2)} tons
 
     **Emission Source Breakdown:**
     - Electricity Emissions: ${emissionImpact.categories.electricity.count} events
       * CO2: ${(emissionImpact.categories.electricity.emissions.CO2/1000 || 0).toFixed(2)} tons
     - Fuel Combustion Emissions: ${emissionImpact.categories.fuelCombustion.count} events
       * CO2: ${(emissionImpact.categories.fuelCombustion.emissions.CO2/1000 || 0).toFixed(2)} tons
     - Shipping Emissions: ${emissionImpact.categories.shipping.count} events
       * CO2: ${(emissionImpact.categories.shipping.emissions.CO2/1000 || 0).toFixed(2)} tons
     - Explosion Emissions: ${emissionImpact.categories.explosion.count} events
       * CO2: ${(emissionImpact.categories.explosion.emissions.CO2/1000 || 0).toFixed(2)} tons
 
     **Goals for the Report:**
     - Clearly outline the environmental impacts caused by the emissions during the specified timeframe.
     - Provide reasons for each impact, directly linking them to the relevant emission levels and types.
     - Use the provided response format strictly, ensuring clear, actionable insights.
 
     **Response Format:**
     - Biodiversity Hazard: [Explain the specific damage caused to local flora and fauna. Provide the reason based on the emission type, e.g., habitat destruction due to high CO2 levels.]
     - Ozone Layer Depletion: [Describe the contribution of NOx and CO2 emissions to ozone layer depletion.]
     - Soil and Water Contamination: [Detail contamination caused by H2S and other emissions, linking it to their chemical properties.]
     - Heat Island Effect: [Discuss how urban heat pockets are formed due to high CO2 levels.]
     - Climate Refugees: [Provide an estimated number of displaced people, based on the severity of the emissions.]
     - Public Health Hazards: [Highlight specific health risks caused by NOx, CO, and other emissions.]
     - Agricultural Disruption: [Explain crop damage or loss due to soil or water contamination or temperature changes.]
     - Weather Impact: [Describe long-term impacts on weather patterns, such as temperature shifts or increased variability.]
 
     **Important Note:** Be concise, scientifically precise, and base all conclusions on the emission data provided. Avoid deviating from the specified response format.
 
     Example for Formatting: (Take this as an example only)
     **Electricity Emissions:**
     - Biodiversity Hazard: Destruction of local habitats due to industrial activities
     - Ozone Layer Depletion: Significant depletion linked to NOx emissions, increasing UV radiation risk
     - Soil and Water Contamination: Acidic runoff from facilities contaminates local water sources
     - Heat Island Effect: Urban areas become hotter due to elevated CO2 levels
     - Climate Refugees: 50 families displaced due to rising sea levels attributed to emissions
     - Public Health Hazards: Increased respiratory illnesses from prolonged exposure to NOx
     - Agricultural Disruption: Crop failures caused by higher temperatures and soil erosion
     - Weather Impact: Unpredictable rainfall patterns caused by atmospheric changes
 
     Your analysis must be structured exactly as the format above, with reasons included for every impact mentioned.
 `;
 

    // Make API request to Cohere AI for generating the analysis
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command-xlarge",
        prompt,
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cohere AI Response:", response.data);

    // Extract the response text from the API response
    const aiResponse = response.data?.generations?.[0]?.text || "No response generated.";

    // Prepare final response
    const finalResponse = { 
      startDate, 
      endDate, 
      aiAnalysis: aiResponse,
      emissionImpact: emissionImpact
    };

    // Store the response in cache
    cache.set(cacheKey, finalResponse, 24 * 60 * 60 * 1000);

    res.json(finalResponse);

  } catch (error) {
    // Comprehensive error handling
    console.error("Error analyzing emissions with GenAI:", error);
    
    if (error.response) {
      console.error("Detailed error:", error.response.data);
      return res.status(error.response.status).json({ 
        error: error.response.data 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to analyze emissions data with GenAI.",
      details: error.message 
    });
  }
};

// Periodic cache cleanup
setInterval(() => {
  console.log("Performing periodic cache cleanup");
  cache.clear();
}, 24 * 60 * 60 * 1000);