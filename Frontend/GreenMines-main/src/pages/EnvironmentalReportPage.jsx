import React, { useState, useRef, useEffect } from 'react';
import { 
    Container, 
    Alert, 
    CircularProgress, 
    Box, 
    Grid, 
    Typography, 
    Paper, 
    Tabs, 
    Tab, 
    Button, 
    Card, 
    CardContent, 
    Fade 
} from '@mui/material';
import { 
    Assessment as AssessmentIcon, 
    CalendarToday as CalendarTodayIcon, 
    Timeline as TimelineIcon 
} from '@mui/icons-material';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReportGenerator from '../Components/EnvironmentalReport/ReportGenerator';
import ReportDisplay from '../Components/EnvironmentalReport/ReportDisplay';
import ReportStats from '../Components/EnvironmentalReport/ReportStats';
import PDFDownloadButton from '../Components/EnvironmentalReport/PDFDownloadButton';
import { useLocation } from 'react-router-dom';
import { 
    fetchDailyEnvironmentalReport, 
    fetchMonthlyEnvironmentalReport, 
    fetchWeeklyEnvironmentalReport 
} from '../services/environmentalReportService';

const EnvironmentalReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState(null);
    const location = useLocation();
    const [currentReportType, setCurrentReportType] = useState('daily');

    // Create refs for charts and stats
    const donutChartRef = useRef(null);
    const barGraphRef = useRef(null);
    const sinkGraphRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.reportType) {
            setCurrentReportType(location.state.reportType);
            handleGenerateReport(location.state.reportType);
        }
    }, [location.state]);

    const handleGenerateReport = async (type) => {
        setLoading(true);
        setError(null);
        setCurrentReportType(type);
        try {
            const response = type === 'daily' 
                ? await fetchDailyEnvironmentalReport()
                : type === 'weekly'
                ? await fetchWeeklyEnvironmentalReport()
                : await fetchMonthlyEnvironmentalReport();
            
            setReportData(response);
        } catch (error) {
            setError('Failed to generate report. Please try again.');
            console.error('Report generation error:', error);
        }
        setLoading(false);
    };

    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };


    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#f0f4f8', // Soft blue-gray background
                py: 4,
                background: 'linear-gradient(135deg, #f0f4f8 30%, #cad8fa 100%)'
            }}
        >
            <Container maxWidth="lg">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 3, 
                        background: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography 
                        variant="h4" 
                        color="white" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold', 
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                        }}
                    >
                        Emission Impact Report
                    </Typography>
                    <button
        onClick={handleBack}
        className="bg-[#5e67af] text-black mb-4 font-bold px-8 py-3 text-xl rounded-lg mt-4 self-start flex items-center space-x-2"
    >
        <FaArrowLeft className="w-6 h-6" />
        <span>Go Back</span>
    </button>
                    <Tabs
    value={currentReportType}
    onChange={(e, newValue) => handleGenerateReport(newValue)}
    textColor="inherit"
    indicatorColor="secondary"
    sx={{ 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        borderRadius: 2 
    }}
>
    <Tab 
        value="daily" 
        label="Daily" 
        icon={<CalendarTodayIcon />} 
        sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)'
            }
        }} 
    />
    <Tab 
        value="weekly" 
        label="Weekly" 
        icon={<TimelineIcon />} 
        sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)'
            }
        }} 
    />
    <Tab 
        value="monthly" 
        label="Monthly" 
        icon={<AssessmentIcon />} 
        sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)'
            }
        }} 
    />
    <Tab 
        value="yearly"  // New tab for yearly report
        label="Yearly"
        icon={<AssessmentIcon />}
        sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.1)'
            }
        }} 
    />
</Tabs>
                </Paper>

                {loading && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        my: 4,
                        backgroundColor: 'transparent'
                    }}>
                        <CircularProgress 
                            size={60} 
                            thickness={4} 
                            sx={{ 
                                color: '#1a237e',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }} 
                        />
                    </Box>
                )}
                
                {error && (
                    <Fade in={!!error}>
                        <Alert 
                            severity="error" 
                            sx={{ 
                                my: 2, 
                                boxShadow: 2,
                                borderRadius: 2,
                                backgroundColor: '#ffebee',
                                '& .MuiAlert-icon': {
                                    color: '#d32f2f'
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    </Fade>
                )}
                
                {reportData && (
                    <Fade in={!!reportData}>
                        <Box sx={{ 
                            backgroundColor: 'white', 
                            borderRadius: 2, 
                            p: 3,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <Grid 
                                container 
                                spacing={2} 
                                alignItems="center" 
                                justifyContent="space-between" 
                                sx={{ mb: 3 }}
                            >
                                <Grid item>
                                    <Card 
                                        variant="outlined" 
                                        sx={{ 
                                            borderRadius: 2, 
                                            background: 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%)',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <CardContent>
                                            <PDFDownloadButton 
                                                reportContent={reportData.report}
                                                reportType={currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)}
                                                chartRefs={[
                                                    donutChartRef, 
                                                    barGraphRef, 
                                                    sinkGraphRef
                                                ]}
                                                statsRef={statsRef}
                                                emissions={reportData.data?.emissions || {
                                                    electricity: 0,
                                                    explosion: 0,
                                                    fuel: 0,
                                                    shipping: 0,
                                                    totalEmissions: 0,
                                                    carbonSequestration: 0
                                                }}
                                                charts={{
                                                    donutChart: {
                                                        ref: donutChartRef,
                                                        title: 'Emissions Distribution'
                                                    },
                                                    barGraph: {
                                                        ref: barGraphRef,
                                                        title: 'Emissions by Source'
                                                    },
                                                    sinkGraph: {
                                                        ref: sinkGraphRef,
                                                        title: 'Emissions Trend'
                                                    }
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <div ref={statsRef}>
                                <ReportStats 
                                    data={reportData.data} 
                                    reportType={currentReportType}
                                    chartRefs={{
                                        donutChartRef,
                                        barGraphRef,
                                        sinkGraphRef
                                    }}
                                />
                            </div>
                            <ReportDisplay report={reportData.report} />
                        </Box>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default EnvironmentalReportPage;