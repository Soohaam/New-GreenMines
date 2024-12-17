import React from 'react';
import EmissionDonutChart from './Charts/EmissionDonutChart';
import EmissionBarGraph from './Charts/EmissionBarGraph';
import EmissionMultiLineGraph from './Charts/EmissionMultiLineGraph';
import SinkBarGraph from './Charts/SinkBarGraph';
import { Grid, Card, CardContent, Typography, Box, Divider, Alert } from '@mui/material';

const ReportStats = ({ data, reportType, chartRefs }) => {
    if (!data) return null;

    const formatNumber = (num) => Number(num).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Calculate totals for each category
    const calculateTotalEmissions = (items) => {
        return items.reduce((sum, item) => {
            let co2Value = 0;
            if (item.result && item.result.CO2) {
                co2Value = parseFloat(item.result.CO2.value) / 1000; // Convert to tons
            } else if (item.emissions && item.emissions.CO2) {
                co2Value = parseFloat(item.emissions.CO2) / 1000;
            } else if (item.result && item.result.carbonEmissions) {
                co2Value = parseFloat(item.result.carbonEmissions.kilograms) / 1000;
            } else if (item.co2Emissions) {
                co2Value = parseFloat(item.co2Emissions) / 1000;
            }
            return sum + (isNaN(co2Value) ? 0 : co2Value);
        }, 0);
    };

    // Calculate total sink absorption
    const calculateTotalAbsorption = (sinks) => {
        return sinks.reduce((sum, sink) => {
            const dailyRate = sink.dailySequestrationRate || 
                (sink.carbonSequestrationRate / 365);
            return sum + (dailyRate * sink.areaCovered);
        }, 0);
    };

    const totals = {
        electricity: calculateTotalEmissions(data.electricity),
        explosion: calculateTotalEmissions(data.explosion),
        fuel: calculateTotalEmissions(data.fuelCombustion),
        shipping: calculateTotalEmissions(data.shipping),
        coal: calculateTotalEmissions(data.coal)
    };

    const totalEmissions = Object.values(totals).reduce((a, b) => a + b, 0);
    const totalAbsorption = calculateTotalAbsorption(data.sinks);
    const carbonGap = totalEmissions - totalAbsorption;
    const absorptionPercentage = (totalAbsorption / totalEmissions) * 100;
    
    // Calculate required additional sink area
    const averageSequestrationRate = data.sinks.length > 0 
        ? data.sinks.reduce((sum, sink) => sum + sink.carbonSequestrationRate, 0) / data.sinks.length 
        : 0;
    const additionalSinkAreaNeeded = carbonGap > 0 && averageSequestrationRate > 0
        ? (carbonGap * 365) / averageSequestrationRate
        : 0;

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            {/* Entries Section */}
            <div data-testid="entries-section">
                <Typography variant="h5" gutterBottom>
                    Emission Impact Statistics
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary">
                                    Electricity
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                    Electricity Consumption
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
  {formatNumber(totals.electricity / 0.7)} kWh
</Typography>

                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Emissions
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="error">
                                        {formatNumber(totals.electricity)} tons CO₂e
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }} >
                                    {((totals.electricity / totalEmissions) * 100).toFixed(1)}% of total emissions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary">
                                    Explosion
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Explosion Emission
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {formatNumber(totals.explosion / 0.5)} Kg
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Emissions
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="error">
                                        {formatNumber(totals.explosion)} tons CO₂e
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                    {((totals.explosion / totalEmissions) * 100).toFixed(1)}% of total emissions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary">
                                    Fuel 
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                    Fuel Combustion
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {formatNumber(totals.fuel / 2.5)} Kg or Liters
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Emissions
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="error">
                                        {formatNumber(totals.fuel)} tons CO₂e
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    {((totals.fuel / totalEmissions) * 100).toFixed(1)}% of total emissions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}color="primary">
                                    Shipping
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Shipping distance
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {formatNumber(totals.shipping / 0.03)} Km
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Emissions
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="error">
                                        {formatNumber(totals.shipping)} tons CO₂e
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary" >
                                    {((totals.shipping / totalEmissions) * 100).toFixed(1)}% of total emissions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary">
                Coal
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Coal Emission
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(totals.coal / 1.2)} Kg
                </Typography>
            </Box>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    Total Emissions
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="error">
                    {formatNumber(totals.coal)} tons CO₂e
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                {((totals.coal / totalEmissions) * 100).toFixed(1)}% of total emissions
            </Typography>
        </CardContent>
    </Card>
</Grid>


                {/* Total Environmental Impact Card */}
                <Box sx={{ mt: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                                Total Emission Impact
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                        Total Emissions
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} color="error">
                                        {formatNumber(totalEmissions)} tons CO₂e
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                        Total Emission 
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {formatNumber(
                                    totals.electricity + 
                                    totals.explosion + 
                                    totals.fuel + 
                                    totals.shipping+
                                    totals.coal
                                )} Tons
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                        Average Emissions per Entry
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} color="warning.main">
                                        {formatNumber(totalEmissions / (data.electricity.length + data.explosion.length + 
                                         data.fuelCombustion.length + data.shipping.length))} tons CO₂e
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>

                {/* Carbon Sinks Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary">
                                Carbon Sinks
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                    Total Absorption
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="success.main">
                                    {formatNumber(totalAbsorption)} tons CO₂e/day
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                {formatNumber(absorptionPercentage)}% of emissions offset
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Carbon Balance Analysis Card */}
                <Box sx={{ mt: 2 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                                Carbon Balance Analysis
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                        Total Daily Emissions
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} color="error">
                                        {formatNumber(totalEmissions)} tons CO₂e
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                        Total Daily Absorption
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} color="success.main">
                                        {formatNumber(totalAbsorption)} tons CO₂e
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                                        Net Carbon Balance
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }} color={carbonGap > 0 ? "error.main" : "success.main"}>
                                        {carbonGap > 0 ? '+' : ''}{formatNumber(carbonGap)} tonsCO₂e
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* Carbon Gap Analysis */}
                            <Box sx={{ mt: 3 }}>
                                <Alert severity={carbonGap > 0 ? "warning" : "success"} sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {carbonGap > 0 
                                            ? `Current carbon sinks are offsetting ${formatNumber(absorptionPercentage)}% of emissions. Additional carbon sinks are needed.`
                                            : "Carbon neutrality achieved! Current sinks are sufficient to offset all emissions."}
                                    </Typography>
                                </Alert>

                                {carbonGap > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                                            Recommendations for Carbon Neutrality
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }} paragraph>
                                            To achieve carbon neutrality, you need either:
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    Additional sink area of approximately {formatNumber(additionalSinkAreaNeeded)} hectares
                                                    (based on current average sequestration rate)
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    Reduction in emissions by {formatNumber(carbonGap)} tons CO₂e per day
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    A combination of both approaches
                                                </Typography>
                                            </li>
                                        </ul>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </div>

            {/* Charts Section */}
            <div data-testid="charts-section">
                <Box sx={{ mt: 4 }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#2c3e50', 
                            marginBottom: 3,
                            textAlign: 'center'
                        }}
                    >
                        Emissions Visualization
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', boxShadow: 3 }}>
                                <CardContent>
                                <Typography 
                                 variant="h6" 
                                 color="primary" 
                                 sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 2 }}
                             >
                                 Emissions Distribution
                             </Typography>
                             
                                    <div 
                                        ref={chartRefs.donutChartRef}
                                        style={{ 
                                            width: '100%', 
                                            height: '400px',
                                            overflow: 'visible' 
                                        }}
                                    >
                                        <EmissionDonutChart data={data} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ height: '100%', boxShadow: 3 }}>
                                <CardContent>
                                <Typography 
    variant="h6" 
    color="primary" 
    sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 2 }}
>
    Emissions Distribution
</Typography>

                                    <div 
                                        ref={chartRefs.barGraphRef}
                                        style={{ 
                                            width: '100%', 
                                            height: '500px',
                                            overflow: 'visible' 
                                        }}
                                    >
                                        <EmissionBarGraph data={data} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
    <Card>
        {/* <CardContent>
        
                                    <div 
                                        ref={chartRefs.sinkGraphRef}
                                        style={{ 
                                            width: '100%', 
                                            height: '500px',
                                            overflow: 'visible' 
                                        }}
                                    >
            <SinkBarGraph data={data} /> 
            </div>
        </CardContent> */}
    </Card>
</Grid>

                    </Grid>
                </Box>
            </div>
        </Box>
    );
};

export default ReportStats;