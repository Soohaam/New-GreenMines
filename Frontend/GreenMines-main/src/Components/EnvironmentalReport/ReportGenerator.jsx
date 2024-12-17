import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

const ReportGenerator = ({ onGenerateReport }) => {
    return (
        <ButtonGroup variant="contained">
            <Button onClick={() => onGenerateReport('daily')}>
                Generate Daily Report
            </Button>
            <Button onClick={() => onGenerateReport('weekly')}>
                Generate Weekly Report
            </Button>
            <Button onClick={() => onGenerateReport('monthly')}>
                Generate Monthly Report  {/* New button added */}
            </Button>
        </ButtonGroup>
    );
};

export default ReportGenerator;