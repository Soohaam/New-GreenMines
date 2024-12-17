import axios from 'axios';

const API_URL = 'http://localhost:5000/api/environmental-reports';

export const fetchDailyEnvironmentalReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/daily`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchWeeklyEnvironmentalReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/weekly`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchMonthlyEnvironmentalReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/monthly`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchYearlyEnvironmentalReport = async () => {
    try {
        const response = await axios.get(`${API_URL}/yearly`);
        return response.data;
    } catch (error) {
        throw error;
    }
};