import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFDownloadButton = ({ 
    reportContent, 
    reportType = 'Environmental', 
    chartRefs,
    statsRef,
    children 
}) => {
    const generatePDF = async () => {
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Enhanced capture function for charts and stats
        const captureFullElementImage = async (element, options = {}) => {
            if (!element) return null;
        
            try {
                const clonedElement = element.cloneNode(true);
                document.body.appendChild(clonedElement);
                clonedElement.style.position = 'absolute';
                clonedElement.style.left = '0';
                clonedElement.style.top = '0';
                clonedElement.style.width = 'auto';
                clonedElement.style.height = 'auto';
                clonedElement.style.overflow = 'visible';
        
                // Adding a small delay to ensure the chart is fully rendered
                await new Promise(resolve => setTimeout(resolve, 2500));  // Adjust delay as needed
        
                const canvas = await html2canvas(clonedElement, {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    foreignObjectRendering: true,
                    backgroundColor: '#ffffff',
                    ...options
                });
        
                document.body.removeChild(clonedElement);
                return canvas.toDataURL('image/png');
            } catch (error) {
                console.error('Error capturing element:', error);
                return null;
            }
        };
        

        // Create cover page
        const createCoverPage = () => {
            pdf.setFillColor(26, 35, 126);
            pdf.rect(0, 0, pageWidth, 150, 'F');

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(30);
            pdf.setFont('Poppins', 'bold');
            pdf.text('Emission Impact Report', pageWidth/2, 70, {align: 'center'});

            pdf.setFontSize(20);
            pdf.text(`${reportType} Analysis`, pageWidth/2, 100, {align: 'center'});

            pdf.setFontSize(16);
            pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth/2, 130, {align: 'center'});

            pdf.setTextColor(0, 0, 0);
        };

        // Add emissions summary
        const addEmissionsSummary = () => {
            // Extract emissions data
            const emissions = reportContent?.data?.emissions || {};

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Emissions Summary', 20, 180);

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            const summaryItems = [
                `Total Emissions: ${emissions.totalEmissions || 'N/A'} metric tons CO₂e`,
                `Electricity Emissions: ${emissions.electricity?.toFixed(2) || 'N/A'} metric tons CO₂e`,
                `Explosion Emissions: ${emissions.explosion?.toFixed(2) || 'N/A'} metric tons CO₂e`,
                `Fuel Emissions: ${emissions.fuel?.toFixed(2) || 'N/A'} metric tons CO₂e`,
                `Shipping Emissions: ${emissions.shipping?.toFixed(2) || 'N/A'} metric tons CO₂e`,
                `Carbon Sequestration: ${emissions.carbonSequestration?.toFixed(2) || 'N/A'} tonnes CO₂e/day`
            ];

            summaryItems.forEach((item, index) => {
                pdf.text(item, 30, 210 + (index * 20));
            });
        };

       //Add Charts 
       const addCharts = async () => {
        try {
          if (chartRefs && chartRefs.length > 0) {
            pdf.addPage();
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Visual Analysis', 20, 30);
      
            let currentY = 60;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const chartWidth = pageWidth - 40; // Leave margins
            const chartHeight = 250; // Adjusted for better fit
      
            for (const chartRef of chartRefs) {
              if (chartRef.current) {
                try {
                  // Key modification: Ensure full chart visibility
                  const canvas = chartRef.current.querySelector('canvas');
                  
                  if (!canvas) {
                    console.error('No canvas found in chart ref');
                    continue;
                  }
      
                  // Capture the canvas directly
                  const chartImage = canvas.toDataURL('image/png');
      
                  if (chartImage) {
                    if (currentY + chartHeight > pageHeight) {
                      pdf.addPage();
                      currentY = 30;
                    }
      
                    try {
                      // Remove the data URL prefix
                      const base64Image = chartImage.split(',')[1];
                      
                      pdf.addImage(
                        base64Image, 
                        'PNG', 
                        20,  // x-coordinate 
                        currentY, 
                        chartWidth, 
                        chartHeight,
                        '', 
                        'FAST'
                      );
                      
                      currentY += chartHeight + 20; // Space between charts
                    } catch (addImageError) {
                      console.error('Error adding image to PDF:', addImageError);
                    }
                  } else {
                    console.error('No chart image captured');
                  }
                } catch (captureError) {
                  console.error('Error capturing chart image:', captureError);
                }
              }
            }
          }
        } catch (overallError) {
          console.error('Overall error in addCharts:', overallError);
        }
      };
        

        // Advanced HTML content parsing
        const parseHTMLContent = (htmlContent) => {
            // Safely extract content
            const extractContent = () => {
                if (htmlContent && htmlContent.data && htmlContent.data.response) {
                    return htmlContent.data.response;
                }
                
                if (typeof htmlContent === 'string') {
                    return htmlContent;
                }
                
                return String(htmlContent);
            };

            const rawContent = extractContent();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawContent;

            // Enhanced structured content extraction
            const extractStructuredContent = (node) => {
                let content = [];

                const processNode = (node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        switch (node.tagName.toLowerCase()) {
                            case 'h3':
                                content.push({
                                    type: 'mainHeading',
                                    text: node.textContent.toUpperCase().trim()
                                });
                                break;
                            case 'ul':
                                content.push({
                                    type: 'list',
                                    items: Array.from(node.querySelectorAll('li')).map(li => li.textContent.trim())
                                });
                                break;
                            case 'p':
                                content.push({
                                    type: 'paragraph',
                                    text: node.textContent.trim()
                                });
                                break;
                        }
                    }
                };

                node.childNodes.forEach(processNode);
                return content;
            };

            try {
                return extractStructuredContent(tempDiv);
            } catch (error) {
                console.error('HTML parsing error:', error);
                return rawContent;
            }
        };

        // Add detailed report with enhanced styling
        const addDetailedReport = (pdf, structuredContent) => {
            let currentY = 60;

            // Iterate through structured content
            structuredContent.forEach(item => {
                switch (item.type) {
                    case 'mainHeading':
                        // Main Heading Style
                        pdf.setFontSize(22);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setTextColor(26, 35, 126); // Deep blue
                        
                        // Split long headings
                        const headingSplitText = pdf.splitTextToSize(item.text, pageWidth - 40);
                        pdf.text(headingSplitText, 20, currentY);
                        currentY += (headingSplitText.length * 25);
                        break;

                    case 'list':
                        // List Style
                        pdf.setFontSize(18);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(0, 0, 0); // Black
                        
                        item.items.forEach(listItem => {
                            // Split long list items
                            const listSplitText = pdf.splitTextToSize(`• ${listItem}`, pageWidth - 40);
                            pdf.text(listSplitText, 30, currentY);
                            currentY += (listSplitText.length * 15);
                        });
                        currentY += 15;
                        break;

                    case 'paragraph':
                        // Paragraph Style
                        pdf.setFontSize(18);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(50, 50, 50); // Dark gray
                        
                        // Split paragraphs
                        const paragraphSplitText = pdf.splitTextToSize(item.text, pageWidth - 40);
                        pdf.text(paragraphSplitText, 20, currentY);
                        currentY += (paragraphSplitText.length * 15);
                        break;
                }

                // Add new page if content exceeds page height
                if (currentY >= pageHeight - 50) {
                    pdf.addPage();
                    currentY = 60;
                }
            });
        };

        try {
            // Generate PDF sections
            createCoverPage();
            addEmissionsSummary();

            // Add statistics page
            if (statsRef?.current) {
                pdf.addPage();
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Detailed Statistics', 20, 30);
            
                const statsImage = await captureFullElementImage(statsRef.current);
                if (statsImage) {
                    pdf.addImage(statsImage, 'PNG', 20, 50, pageWidth - 40, 0);
                }
            }

            // Add charts
            await addCharts();

            // Add detailed report content
            const structuredContent = parseHTMLContent(reportContent);
            pdf.addPage();
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Detailed Report', 20, 30);

            // Add structured content with enhanced styling
            addDetailedReport(pdf, structuredContent);

            // Add metadata
            pdf.setProperties({
                title: `${reportType} Environmental Report`,
                subject: 'Environmental Impact Analysis',
                author: 'GreenMines',
                keywords: 'environmental, sustainability, emissions, carbon',
                creator: 'GreenMines Environmental Report Generator'
            });

            // Save PDF
            pdf.save(`GreenMines_${reportType}_Report_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={generatePDF}
            sx={{ 
                marginTop: 2, 
                marginBottom: 2,
                backgroundColor: '#1a237e',
                '&:hover': {
                    backgroundColor: '#283593',
                },
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 'bold'
            }}
        >
            {children || 'Download Full Report'}
        </Button>
    );
};

export default PDFDownloadButton;