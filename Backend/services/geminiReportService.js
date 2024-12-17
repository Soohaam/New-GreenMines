// services/geminiReportService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY3);

const generateEnvironmentalReportContent = async (data) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            generationConfig: {
                maxOutputTokens: 5000,  // Increased token limit
                temperature: 0.7,        // Balanced creativity
                topP: 0.9,               // Diverse response
                stopSequences: []        // Allow full response
            }
        });

        // Helper function to safely parse numbers
        const parseNumber = (value) => {
            if (!value) return 0;
            const parsed = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        };

        // Calculate Electricity Emissions
        const totalElectricityEmissions = data.electricity.reduce((sum, item) => {
            try {
                if (item.result) {
                    const resultObj = Object.fromEntries(item.result);
                    if (resultObj.CO2 && resultObj.CO2.value) {
                        const value = parseNumber(resultObj.CO2.value);
                        console.log('Individual Electricity CO2:', value);
                        return sum + value;
                    }
                }
                return sum;
            } catch (error) {
                console.error('Error processing electricity item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Electricity Emissions:', totalElectricityEmissions);

        // Calculate Explosion Emissions
        const totalExplosionEmissions = data.explosion.reduce((sum, item) => {
            try {
                if (item.emissions && item.emissions.CO2) {
                    const value = parseNumber(item.emissions.CO2);
                    console.log('Individual Explosion CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing explosion item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Explosion Emissions:', totalExplosionEmissions);

        // Calculate Fuel Emissions
        const totalFuelEmissions = data.fuelCombustion.reduce((sum, item) => {
            try {
                if (item.result && item.result.CO2 && item.result.CO2.value) {
                    const value = parseNumber(item.result.CO2.value);
                    console.log('Individual Fuel CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing fuel item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Fuel Emissions:', totalFuelEmissions);

        // Calculate Shipping Emissions
        const totalShippingEmissions = data.shipping.reduce((sum, item) => {
            try {
                if (item.result && item.result.carbonEmissions && item.result.carbonEmissions.kilograms) {
                    const value = parseNumber(item.result.carbonEmissions.kilograms);
                    console.log('Individual Shipping CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing shipping item:', error);
                return sum;
            }
        }, 0);
        console.log('Total Shipping Emissions:', totalShippingEmissions);

        // Calculate coal Emissions
        const totalCoalEmissions = data.coal.reduce((sum, item) => {
            try {
                if (item.co2Emissions) {
                    const value = parseNumber(item.co2Emissions);
                    console.log('Individual Coal CO2:', value);
                    return sum + value;
                }
                return sum;
            } catch (error) {
                console.error('Error processing coal item:', error);
                return sum;
            }
        }, 0);
        console.log('Total coal Emissions:', totalCoalEmissions);

        const totalCarbonSequestration = data.sinks.reduce((sum, item) => {
            const dailyRate = item.dailySequestrationRate || 
                (item.carbonSequestrationRate / 365);
            const value = dailyRate * item.areaCovered;
            console.log('Sink absorption value:', value);
            return sum + value;
        }, 0);
        console.log('Total Carbon Sequestration:', totalCarbonSequestration);

        // Format detailed data for better reporting
        const formatElectricityData = data.electricity.map(item => {
            const resultObj = Object.fromEntries(item.result);
            return {
                stateName: item.stateName,
                energyPerTime: item.energyPerTime,
                area: `${item.responsibleArea}/${item.totalArea}`,
                emissions: resultObj,
                co2Emissions: parseNumber(resultObj.CO2.value)
            };
        });

        const formatExplosionData = data.explosion.map(item => ({
            type: item.explosiveType,
            amount: item.amount,
            emissions: item.emissions,
            co2Emissions: parseNumber(item.emissions.CO2)
        }));

        const formatFuelData = data.fuelCombustion.map(item => ({
            fuelType: item.fuel,
            quantity: item.quantityFuelConsumed,
            emissions: item.result,
            co2Emissions: parseNumber(item.result.CO2.value) 
        }));

        const formatShippingData = data.shipping.map(item => ({
            weight: `${item.weight_value} ${item.weight_unit}`,
            distance: `${item.distance_value} ${item.distance_unit}`,
            method: item.transport_method,
            emissions: item.result,
            co2Emissions: parseNumber(item.result.carbonEmissions.kilograms) 
        }));

        const formatCoalData = data.coal.map(item => ({
            type: item.coalType,
            consumption: item.coalConsumption,
            factor: item.emissionFactor,
            co2factor: item.carbonOxidationFactor,
            emissions: item.co2Emissions,
            co2Emissions: parseNumber(item.co2Emissions)
        }));

        // Log the raw data for debugging
        console.log('Raw Electricity Data:', JSON.stringify(data.electricity[0]?.result));
        console.log('Raw Explosion Data:', JSON.stringify(data.explosion[0]?.emissions));
        console.log('Raw Fuel Data:', JSON.stringify(data.fuelCombustion[0]?.result));
        console.log('Raw Shipping Data:', JSON.stringify(data.shipping[0]?.result));
        console.log('Raw coal Data:', JSON.stringify(data.coal[0]?.co2Emissions));

        const emissionsInTons = {
            electricity: totalElectricityEmissions / 1000, // Convert kg to metric tons
            explosion: totalExplosionEmissions / 1000,
            fuel: totalFuelEmissions / 1000,
            shipping: totalShippingEmissions / 1000,
            coal: totalCoalEmissions /1000
        };

        console.log('\nFinal Emissions in Metric Tons:', emissionsInTons);

        const prompt = `Generate a comprehensive environmental impact report based on the following data:

        1. Electricity Emissions:
        - Total Entries: ${data.electricity.length}
        - Total CO2 Emissions: ${emissionsInTons.electricity.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalElectricityEmissions.toFixed(2)} kg CO2e
        - Analysis of the above data
        
        2. Explosion Emissions:
        - Total Entries: ${data.explosion.length}
        - Total CO2 Emissions: ${emissionsInTons.explosion.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalExplosionEmissions.toFixed(2)} kg CO2e
        - Analysis of the above data
        
        3. Fuel Combustion Emissions:
        - Total Entries: ${data.fuelCombustion.length}
        - Total CO2 Emissions: ${emissionsInTons.fuel.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalFuelEmissions.toFixed(2)} kg CO2e
        - Analysis of the above data
        
        4. Shipping Emissions:
        - Total Entries: ${data.shipping.length}
        - Total CO2 Emissions: ${emissionsInTons.shipping.toFixed(2)} metric tons CO2e
        - Raw Emissions Value: ${totalShippingEmissions.toFixed(2)} kg CO2e
        - Analysis of the above data

        5. Carbon Sinks:
        - Total Entries: ${data.sinks.length}
        - Total Daily Carbon Sequestration: ${totalCarbonSequestration.toFixed(2)} tonnes CO2e
        - Analysis of the above data
        

        
       
Please provide a detailed environmental impact report including:

6.  Summary Metrics:
        - Total Combined Emissions: ${(emissionsInTons.electricity + emissionsInTons.explosion + emissionsInTons.fuel + emissionsInTons.shipping).toFixed(2)} metric tons CO2e
                
7. Detailed Analysis of Each Emission Source:
   - Electricity Usage Analysis
   - Explosion-Related Emissions Analysis
   - Fuel Combustion Analysis
   - Shipping Emissions Analysis
   - Carbon Sinks (provide details of above carbon emission and absorbtion and compare it and give an analysis of how much emission will be covered in this sink how much more sink we will need to neutralize all the carbon emission)
8. Comparative Analysis
9. Trends and Patterns
DETAILED EMISSION SOURCE ANALYSIS

Electricity Emissions: The Silent Environmental Challenge
The electricity sector emerges as a critical area of environmental concern. With ${data.electricity.length} recorded entries generating ${emissionsInTons.electricity.toFixed(2)} metric tons of CO2, our energy infrastructure represents both our greatest challenge and most promising opportunity for sustainable transformation. 

10. Key Considerations:(detailed explaination)


Industrial Explosions: Unraveling the Environmental Consequences
Often overlooked, explosion-related emissions tell a complex story of industrial processes and environmental impact. Our data reveals ${emissionsInTons.explosion.toFixed(2)} metric tons of CO2 equivalent from ${data.explosion.length} recorded events, highlighting the critical need for more sustainable industrial practices.

11. Strategic Insights:(detailed explaination in a paragraph format)


Fuel Combustion: The Hidden Carbon Footprint
Fuel combustion represents a significant component of our emissions profile. With ${emissionsInTons.fuel.toFixed(2)} metric tons of CO2 from ${data.fuelCombustion.length} entries, this sector demands innovative approaches to efficiency and sustainability.

12. Transformative Potential:(detailed explaination in a paragraph format)


Shipping Emissions: Navigating Towards Sustainability
The shipping sector contributes ${emissionsInTons.shipping.toFixed(2)} metric tons of CO2 equivalent across ${data.shipping.length} entries, underscoring the urgent need for green logistics and transportation strategies.

13. Innovative Pathways:(detailed explaination in a paragraph format)


14. LAND USE AND ECOSYSTEM IMPACT (AFOLU ANALYSIS)(detailed explaination use the above information of total co2 emission for electricity, explosion,fuel and shipping and even the Total Daily Carbon Sequestration information)

Beyond the raw emissions data lies a profound story of ecological interaction. Our activities don't just produce carbon; they fundamentally alter landscapes, disrupt ecosystems, and challenge the delicate balance of natural systems.

15. Land Restoration Dynamics:(detailed explaination)
The environmental impact extends far beyond immediate carbon emissions. Each ton of CO2 represents potential land degradation, biodiversity loss, and ecosystem disruption. Our current emissions suggest:



16. CARBON SEQUESTRATION: A RAY OF HOPE

Our ${data.sinks.length} carbon sinks represent more than statistical entries; they are living, breathing solutions to our environmental challenges. Capturing ${totalCarbonSequestration.toFixed(2)} tonnes of CO2 daily, these natural carbon capture mechanisms offer a glimpse into a more sustainable future.

Sink Potential Highlights:(detailed explaination in a paragraph format)


17. ECONOMIC AND STRATEGIC IMPLICATIONS

The environmental challenge is fundamentally an economic opportunity. Our emissions represent not just an ecological cost, but a potential pathway to innovation, efficiency, and sustainable economic development.

18. Financial Perspective:(detailed explaination in a paragraph format)

STRATEGIC RECOMMENDATIONS

1. Immediate Emission Reduction Strategies(detailed explaination in a paragraph format)
  

2. Medium-Term Sustainability Goals(detailed explaination in a paragraph format)
   

3. Long-Term Ecological Transformation(detailed explaination in a paragraph format)
   

CONCLUSION: A CALL TO TRANSFORMATIVE ACTION

This report is more than a collection of data points; it's a narrative of potential, a roadmap to a sustainable future. Our environmental challenges are complex, but they are not insurmountable. With strategic thinking, innovative technologies, and a commitment to holistic sustainability, we can transform our environmental impact.

The journey towards sustainability is not a destination, but a continuous process of learning, adapting, and innovating.

Please format the report in a clear, structured manner with appropriate headings and subheadings.`;

const result = await model.generateContent(prompt);
        
// Extract and format the AI response
const aiResponse = result.response.text();
const formattedResponse = formatResponse(aiResponse);

// Return formatted response with status and data
return {
    status: 'success',
    data: {
        emissions: {
            electricity: emissionsInTons.electricity,
            explosion: emissionsInTons.explosion,
            fuel: emissionsInTons.fuel,
            shipping: emissionsInTons.shipping,
            totalEmissions: (emissionsInTons.electricity + emissionsInTons.explosion + 
                           emissionsInTons.fuel + emissionsInTons.shipping).toFixed(2),
            carbonSequestration: totalCarbonSequestration
        },
        response: formattedResponse
    }
};

} catch (error) {
console.error('Error generating environmental report:', error);
return {
    status: 'error',
    message: 'Environmental report generation failed.',
    errorDetails: error.message
};
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

module.exports = { generateEnvironmentalReportContent };