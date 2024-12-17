const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini SDK
require('dotenv').config();


// Gemini API initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2); // Replace with your Gemini API Key
const model = genAI.getGenerativeModel({
    model: "gemini-pro", // Use your desired Gemini model
    maxTokens: 4500 // Adjust this based on your required token limit
});



// AFOLU Controller
exports.afolu = async (req, res) => {
    const { landSize, currentLandUse, carbonStock, clearingMethod, climateDescription, newLandUse } = req.body;

    // Validation for required fields
    if (!landSize || !currentLandUse || !carbonStock || !clearingMethod || !climateDescription || !newLandUse) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required: landSize, currentLandUse, carbonStock, clearingMethod, climateDescription, newLandUse.'
        });
    }

    try {
        // Construct a context-rich professional prompt for the AFOLU use case
        const afoluPrompt = `
        Context:
        - You are an expert in land use, environmental sustainability, and climate action.
        - Provide insights for estimating the environmental impact of land clearing.

        User Data:
        - Land Size: ${landSize} hectares
        - Current Land Use: ${currentLandUse}
        - Carbon Stock: ${carbonStock} tons per hectare
        - Clearing Method: ${clearingMethod}
        - Climate Description: ${climateDescription}
        - New Land Use: ${newLandUse}

        Goals:
        - Quantify the carbon emissions caused by clearing the land, considering factors such as biomass loss, soil disturbance, and method of clearing.
        - Assess the overall environmental impact from the land clearing process.
        - Recommend mitigation strategies to reduce emissions.
        - Suggest alternative methods for land clearing that align with sustainability goals.

        Response Format:
        - Summary of the estimated environmental impact.
        - Detailed explanation of emissions calculations and assumptions.
        - Estimated Time for Land Recovery
        - Practical mitigation strategies and alternative clearing methods.
        - Actionable next steps or resources for implementing the recommendations.
        `;


        // Call the Gemini API to generate a response
        const result = await model.generateContent(afoluPrompt);

        // Extract and format the AI response
        const aiResponse = result.response.text();
        const formattedResponse = formatResponse(aiResponse);

        // Send response to the client
        res.json({
            status: 'success',
            input: { landSize, currentLandUse, carbonStock, clearingMethod, climateDescription, newLandUse },
            response: formattedResponse
        });
    } catch (error) {
        console.error('Error generating AFOLU insights:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'AFOLU insight generation failed.',
            errorDetails: error.message
        });
    }
};

// Helper function to format AI responses
function formatResponse(aiResponse) {
    // Clean up and structure the response for readability
    aiResponse = aiResponse.replace(/\\n/g, '').trim();
    const sections = aiResponse.split('\n\n');

    let formattedResponse = '';

    sections.forEach(section => {
        if (section.startsWith('**') || section.match(/^[A-Za-z\s]+:/)) {
            formattedResponse += `<h3>${section.replace(/\*\*/g, '').trim()}</h3>`;
        } else if (section.trim().startsWith('-') || section.trim().startsWith('*')) {
            const bulletPoints = section.split('\n').map(point => point.replace(/^-|\*/g, '').trim());
            formattedResponse += '<ul>';
            bulletPoints.forEach(point => {
                if (point) formattedResponse += `<li>${point}</li>`;
            });
            formattedResponse += '</ul>';
        } else {
            formattedResponse += `<p>${section.trim()}</p>`;
        }
    });

    return formattedResponse;
}
