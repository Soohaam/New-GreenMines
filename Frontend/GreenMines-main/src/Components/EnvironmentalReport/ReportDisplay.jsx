import React from 'react';
import { Paper, Typography, Box, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(3),
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const MainHeading = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    borderBottom: '3px solid #1a237e',
    paddingBottom: theme.spacing(2),
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 600,
    color: '#283593',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: '2px solid #283593',
}));

const SubHeading = styled(Typography)(({ theme }) => ({
    fontSize: '1.5rem',
    fontWeight: 500,
    color: '#303f9f',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
}));

const MetricsCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #e0e0e0',
    marginBottom: theme.spacing(2),
}));

const ReportDisplay = ({ report }) => {
    if (!report || !report.data) return null;

    const { emissions, response } = report.data;

    // Function to create HTML content from the formatted response
    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };

    return (
        <StyledPaper>
            <MainHeading>Emission Impact Report</MainHeading>

            {/* Emissions Summary Section */}
            <Box mb={4}>
                <SectionHeading>Emissions Summary</SectionHeading>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <MetricsCard>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary" gutterBottom>
                                Total Emissions
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="error">
                                {emissions.totalEmissions} metric tons CO₂e
                            </Typography>
                        </MetricsCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MetricsCard>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary" gutterBottom>
                                Carbon Sequestration
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="success.main">
                                {emissions.carbonSequestration.toFixed(2)} tonnes CO₂e/day
                            </Typography>
                        </MetricsCard>
                    </Grid>
                </Grid>

                {/* Detailed Emissions Breakdown */}
                <Box mt={3}>
                    <SubHeading>Emissions Breakdown</SubHeading>
                    <Grid container spacing={2}>
                        {Object.entries(emissions)
                            .filter(([key]) => !['totalEmissions', 'carbonSequestration'].includes(key))
                            .map(([source, value]) => (
                                <Grid item xs={12} sm={6} md={3} key={source}>
                                    <MetricsCard>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} color="textSecondary">
                                            {source.charAt(0).toUpperCase() + source.slice(1)}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary">
                                            {value.toFixed(2)} metric tons CO₂e
                                        </Typography>
                                    </MetricsCard>
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Detailed Report Section */}
            <Box>
                <SectionHeading>Detailed Analysis</SectionHeading>
                <Box 
                    sx={{ 
                        '& h3': {
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#303f9f',
                            marginTop: 4,
                            marginBottom: 2,
                        },
                        '& p': {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            lineHeight: 1.7,
                            color: '#424242',
                            marginBottom: 2,
                        },
                        '& ul': {
                            marginBottom: 2,
                            paddingLeft: 3,
                        },
                        '& li': {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            lineHeight: 1.7,
                            color: '#424242',
                            marginBottom: 1,
                        }
                    }}
                    dangerouslySetInnerHTML={createMarkup(response)}
                />
            </Box>
        </StyledPaper>
    );
};

export default ReportDisplay;