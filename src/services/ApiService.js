import axios from 'axios';

const API_URL = 'http://universities.hipolabs.com';

export const getAllUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}/search?country=United%20Arab%20Emirates`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data from API');
  }
};
