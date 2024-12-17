const Sink = require("../models/Sink");
const ExistingSink = require("../models/ExistingSink");
const Renewable = require("../models/Renewable");
const CCS = require('../models/ccs');
const MCS = require('../models/mcs');

exports.createSink = async (req, res) => {
    try {
      const {
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        location,
        additionalDetails,
        timeframe,
      } = req.body;
  
      const dailySequestrationRate = areaCovered * carbonSequestrationRate / 365; // CSR per day
  
      // Calculate total carbon sequestration based on the provided timeframe
      const totalSequestration = 
        areaCovered * carbonSequestrationRate * (timeframe || 1); // Default timeframe to 1 year if not provided
  
      // Create and save the new sink
      const newSink = new Sink({
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        dailySequestrationRate, // Save daily sequestration rate
        location,
        additionalDetails,
      });
  
      await newSink.save();
  
      // Respond with the calculated sequestration and saved sink data
      res.status(201).json({
        message: "Carbon sink created successfully",
        data: {
          sink: newSink,
          dailySequestrationRate: 
            `${dailySequestrationRate.toFixed(2)} tons of CO2 per hectare per day`,
          totalSequestration: 
            `${totalSequestration.toFixed(2)} tons of CO2 over ${timeframe || 1} year(s)`,
        },
      });
    } catch (error) {
      console.error("Error saving carbon sink:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  exports.createExistingSink = async (req, res) => {
    try {
      const {
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        location,
        additionalDetails,
        timeframe,
      } = req.body;
  
      // Calculate daily sequestration rate
      const dailySequestrationRate = areaCovered * carbonSequestrationRate / 365; // CSR per day
  
      // Calculate total sequestration based on the provided timeframe
      const totalSequestration = 
        areaCovered * carbonSequestrationRate * (timeframe || 1); // Default to 1 year if not provided
  
      // Create and save the new existing sink
      const newExistingSink = new ExistingSink({
        name,
        vegetationType,
        areaCovered,
        carbonSequestrationRate,
        dailySequestrationRate,
        location,
        additionalDetails,
      });
  
      await newExistingSink.save();
  
      // Respond with the calculated sequestration and saved sink data
      res.status(201).json({
        message: "Existing carbon sink created successfully",
        data: {
          sink: newExistingSink,
          dailySequestrationRate: 
            `${dailySequestrationRate.toFixed(2)} tons of CO2 per hectare per day`,
          totalSequestration: 
            `${totalSequestration.toFixed(2)} tons of CO2 over ${timeframe || 1} year(s)`,
        },
      });
    } catch (error) {
      console.error("Error saving existing carbon sink:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  exports.calculateRenewableImpact = async (req, res) => {
    try {
        const {
            solutionName,
            co2EmissionsPerDay,
            selectedRenewable,
            desiredReductionPercentage,
            availableLand
        } = req.body;

        if (!solutionName || !co2EmissionsPerDay || !selectedRenewable || !desiredReductionPercentage || !availableLand) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const co2EmissionsPerDayNum = Number(co2EmissionsPerDay);
        const desiredReductionPercentageNum = Number(desiredReductionPercentage);
        const availableLandNum = Number(availableLand);

        if (isNaN(co2EmissionsPerDayNum) || isNaN(desiredReductionPercentageNum) || isNaN(availableLandNum)) {
            return res.status(400).json({ error: 'Inputs must be valid numbers.' });
        }

        if (co2EmissionsPerDayNum <= 0 || desiredReductionPercentageNum <= 0 || availableLandNum <= 0) {
            return res.status(400).json({ error: 'Inputs must be positive values.' });
        }

        const renewableOptions = {
            Solar: {
                co2ReductionPerUnit: 0.4,
                landRequirementPerUnit: 0.01,
                costPerUnit: 8000,
                timeMultiplier: 1.5,
            },
            Wind: {
                co2ReductionPerUnit: 1.5,
                landRequirementPerUnit: 0.05,
                costPerUnit: 300000,
                timeMultiplier: 2,
            },
            Hydropower: {
                co2ReductionPerUnit: 5,
                landRequirementPerUnit: 2,
                costPerUnit: 5000000,
                timeMultiplier: 3,
            },
            HydrogenElectric: {
                co2ReductionPerUnit: 3,
                landRequirementPerUnit: 1,
                costPerUnit: 2000000,
                timeMultiplier: 2.5,
            },
        };

        const renewable = renewableOptions[selectedRenewable];
        if (!renewable) {
            return res.status(404).json({ error: 'Selected renewable energy source not found.' });
        }

        const targetCo2Reduction = (co2EmissionsPerDayNum * desiredReductionPercentageNum) / 100;

        const requiredUnits = Math.ceil(targetCo2Reduction / renewable.co2ReductionPerUnit);
        const landRequired = requiredUnits * renewable.landRequirementPerUnit;

        let totalReductionPerDay;
        let timeToAchieveNeutrality;
        let implementationCost;

        if (availableLandNum >= landRequired) {
            // Land is sufficient
            totalReductionPerDay = requiredUnits * renewable.co2ReductionPerUnit;
            timeToAchieveNeutrality = Math.ceil(targetCo2Reduction / totalReductionPerDay);
            implementationCost = requiredUnits * renewable.costPerUnit;
        } else {
            // Land is insufficient - scale reduction and cost accordingly
            const deployableUnits = Math.floor(availableLandNum / renewable.landRequirementPerUnit);
            totalReductionPerDay = deployableUnits * renewable.co2ReductionPerUnit;

            if (totalReductionPerDay > 0) {
                timeToAchieveNeutrality = Math.ceil(targetCo2Reduction / totalReductionPerDay);
            } else {
                // Handle the smallest possible deployment scenario
                const fractionalReductionPerDay = availableLandNum * (renewable.co2ReductionPerUnit / renewable.landRequirementPerUnit);
                totalReductionPerDay = fractionalReductionPerDay;
                timeToAchieveNeutrality = Math.ceil(targetCo2Reduction / totalReductionPerDay);
            }

            implementationCost = deployableUnits * renewable.costPerUnit;
        }

        // Avoid edge cases where calculations result in zero values
        if (totalReductionPerDay <= 0) totalReductionPerDay = 0.01;

        const carbonCreditPerTon = 300; // Example: ₹300 per ton of carbon credit
        const carbonCreditsSavedPerDay = totalReductionPerDay; // Each ton of CO2 reduction equals one carbon credit
        const carbonCreditsSavedPerYear = carbonCreditsSavedPerDay * 365; // Total for a year
        const costOfCarbonCreditsSavedPerYear = carbonCreditsSavedPerYear * carbonCreditPerTon; // Total cost savings in a year

        res.json({
            solutionName,
            selectedRenewable,
            implementationCost: `₹${implementationCost.toLocaleString()}`,
            targetCo2Reduction: targetCo2Reduction.toFixed(2),
            totalCo2ReductionPerDay: totalReductionPerDay.toFixed(2),
            landProvided: availableLandNum.toFixed(2),
            timeToAchieveNeutrality: `${timeToAchieveNeutrality} day${timeToAchieveNeutrality > 1 ? 's' : ''}`,
            carbonCreditsSavedPerDay: carbonCreditsSavedPerDay.toFixed(2),
            carbonCreditsSavedPerYear: carbonCreditsSavedPerYear.toFixed(2),
            costOfCarbonCreditsSavedPerYear: `₹${costOfCarbonCreditsSavedPerYear.toLocaleString()}`,
        });
    } catch (error) {
        console.error('Error calculating renewable impact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Predefined capture efficiencies based on CCS technology
const captureEfficiencyMap = {
  "Post-combustion": 0.85,  // 85% efficiency for post-combustion
  "Pre-combustion": 0.90,   // 90% efficiency for pre-combustion
  "Oxy-fuel combustion": 0.95 // 95% efficiency for oxy-fuel combustion
};

// Controller to calculate CCS results based on inputs
exports.calculateCCS = async (req, res) => {
  try {
    const { 
      mineName, 
      annualEmissions, 
      mineSize, 
      ccsTechnology, 
      installationCostPerTon, // Optional
      annualMaintenanceCost // Optional
    } = req.body;

    // Default values if not provided
    const defaultInstallationCostPerTon = 2000; // ₹2000 per ton
    const defaultAnnualMaintenanceCost = 10000000; // ₹10 million/year
    const carbonCreditPrice = 1500; // ₹1500 per ton

    // Ensure numeric conversion
    const convertToNumber = (value, defaultValue) => {
      const num = Number(value);
      return isNaN(num) ? defaultValue : num;
    };

    // Get the capture efficiency based on the CCS technology
    const captureEfficiency = captureEfficiencyMap[ccsTechnology] || 0.85; // Default to 85% if technology is unknown

    // Numeric conversions with default values
    const annualEmissionsNum = convertToNumber(annualEmissions, 0);
    const costPerTon = convertToNumber(installationCostPerTon, defaultInstallationCostPerTon);
    const maintenanceCost = convertToNumber(annualMaintenanceCost, defaultAnnualMaintenanceCost);

    // Calculate captured CO₂ (tons)
    const capturedCO2 = annualEmissionsNum * captureEfficiency;  // in tons of CO₂

    // Calculate installation cost (₹)
    const installationCost = capturedCO2 * costPerTon; // ₹

    // Calculate potential carbon credit revenue (₹)
    const carbonCreditRevenue = capturedCO2 * carbonCreditPrice; // ₹

    // Calculate the total cost for the first year (₹)
    const totalCostForFirstYear = installationCost + maintenanceCost; // ₹

    // Calculate the total revenue for the first year (₹)
    const totalRevenueForFirstYear = carbonCreditRevenue; // ₹

    // Net profit for the first year (installation + maintenance + revenue)
    const netProfitForFirstYear = totalRevenueForFirstYear - totalCostForFirstYear; // ₹

    // Calculate the net profit for the following 9 years
    const annualNetProfit = carbonCreditRevenue - maintenanceCost; // ₹

    // Total profit for 10 years
    const totalProfitForTenYears = netProfitForFirstYear + (annualNetProfit * 9); // ₹

    // Save the data to the database
    const ccsData = new CCS({
      mineName,
      annualEmissions: annualEmissionsNum,
      mineSize,
      ccsTechnology,
      installationCostPerTon: costPerTon,
      annualMaintenanceCost: maintenanceCost,
      captureEfficiency,
      capturedCO2,
      installationCost,
      maintenanceCost,
      carbonCreditRevenue,
      totalCostForFirstYear,
      totalRevenueForFirstYear,
      netProfitForFirstYear,
      annualNetProfit,
      totalProfitForTenYears
    });

    await ccsData.save();

    // Send the response with results for both 1 year and 10 years and proper units
    res.status(200).json({
      message: "CCS calculation successful for 1 year and 10 years",
      data: {
        mineName,
        annualEmissions: annualEmissionsNum,
        mineSize,
        ccsTechnology,
        captureEfficiency: `${(captureEfficiency * 100).toFixed(2)}%`,  // in percentage
        capturedCO2: `${capturedCO2.toFixed(2)} tons`,  // in tons of CO₂
        installationCost: `₹${installationCost.toFixed(2)}`,  // in ₹
        maintenanceCost: `₹${maintenanceCost.toFixed(2)}`,  // in ₹
        carbonCreditRevenue: `₹${carbonCreditRevenue.toFixed(2)}`,  // in ₹
        totalCostForFirstYear: `₹${totalCostForFirstYear.toFixed(2)}`,  // in ₹
        totalRevenueForFirstYear: `₹${totalRevenueForFirstYear.toFixed(2)}`,  // in ₹
        netProfitForFirstYear: `₹${netProfitForFirstYear.toFixed(2)}`,  // in ₹
        annualNetProfit: `₹${annualNetProfit.toFixed(2)}`,  // in ₹ per year
        totalProfitForTenYears: `₹${totalProfitForTenYears.toFixed(2)}`  // in ₹ for 10 years
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.toString() });
  }
};

exports.calculateMCS = async (req, res) => {
  try {
    const {
      mineName,
      annualMethaneEmissions,
      mineSize,
      mcsTechnology,
      utilization = 'energy' // New parameter for methane utilization strategy
    } = req.body;

    // Enhanced Methane Utilization Strategies
    const utilizationStrategies = {
      'energy': {
        efficiencyRate: 0.85,
        revenueModel: {
          type: 'electricity',
          pricePerMWh: 3500, // ₹3,500 per MWh
          conversionFactor: 0.055 // 1 ton of methane ≈ 55 MWh
        }
      },
      'hydrogen': {
        efficiencyRate: 0.75,
        revenueModel: {
          type: 'hydrogen',
          pricePerKg: 250, // ₹250 per kg of hydrogen
          conversionFactor: 0.18 // 1 ton of methane ≈ 180 kg hydrogen
        }
      },
      'liquefied': {
        efficiencyRate: 0.90,
        revenueModel: {
          type: 'LNG',
          pricePerTon: 35000, // ₹35,000 per ton of LNG
          conversionFactor: 0.95 // 1 ton of methane ≈ 0.95 ton LNG
        }
      }
    };

    // Capture Technologies Efficiency
    const captureEfficiencyMap = {
      Flaring: 0.9,
      CatalyticOxidation: 0.85,
      MembraneSeparation: 0.92
    };

    // Validate and get utilization strategy
    if (!utilizationStrategies[utilization]) {
      return res.status(400).json({
        message: 'Invalid methane utilization strategy',
        availableStrategies: Object.keys(utilizationStrategies)
      });
    }

    // Get selected strategy details
    const selectedStrategy = utilizationStrategies[utilization];
    const captureEfficiency = captureEfficiencyMap[mcsTechnology] || 0.85;

    // Calculations
    const capturedMethane = annualMethaneEmissions * captureEfficiency;
    const utilisationEfficiency = selectedStrategy.efficiencyRate;
    const utilizedMethane = capturedMethane * utilisationEfficiency;

    // Revenue Calculation Based on Utilization Strategy
    const revenueModel = selectedStrategy.revenueModel;
    const convertedOutput = utilizedMethane * revenueModel.conversionFactor;
    const strategicRevenue = convertedOutput * revenueModel.pricePerKg || 
                             convertedOutput * revenueModel.pricePerMWh ||
                             convertedOutput * revenueModel.pricePerTon;

    // Carbon Credit Calculation
    const carbonCreditPrice = 1500; // ₹1500 per ton of CO₂ equivalent
    const co2Equivalent = capturedMethane * 25; // Methane Global Warming Potential
    const carbonCreditRevenue = co2Equivalent * carbonCreditPrice;

    // Total Revenue
    const totalRevenue = strategicRevenue + carbonCreditRevenue;

    // Advanced Risk and Efficiency Analysis
    const performanceAnalysis = {
      captureEfficiencyTechnology: `${(captureEfficiency * 100).toFixed(2)}%`,
      utilisationEfficiency: `${(utilisationEfficiency * 100).toFixed(2)}%`,
      utilizationType: revenueModel.type,
      potentialOutputType: `${revenueModel.type.toUpperCase()} Generation`
    };

    // Comprehensive Response
    res.status(200).json({
      message: "Advanced Methane Utilization Analysis",
      projectDetails: {
        mineName,
        mineSize,
        mcsTechnology,
        utilizationStrategy: utilization
      },
      quantitativeResults: {
        annualMethaneEmissions: `${annualMethaneEmissions} tons`,
        capturedMethane: `${capturedMethane.toFixed(2)} tons`,
        utilisedMethane: `${utilizedMethane.toFixed(2)} tons`,
        convertedOutput: `${convertedOutput.toFixed(2)} ${revenueModel.type === 'hydrogen' ? 'kg' : 'ton'}`,
        co2Equivalent: `${co2Equivalent.toFixed(2)} tons`
      },
      financialSummary: {
        strategicRevenue: `₹${strategicRevenue.toFixed(2)}`,
        carbonCreditRevenue: `₹${carbonCreditRevenue.toFixed(2)}`,
        totalRevenue: `₹${totalRevenue.toFixed(2)}`
      },
      performanceAnalysis
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Advanced Methane Utilization Error", 
      error: error.toString() 
    });
  }
};