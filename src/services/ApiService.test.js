import { getAllUniversities } from './ApiService';
import axios from 'axios';

jest.mock('axios');

describe('getAllUniversities', () => {
  it('fetches data from the API successfully', async () => {
    const responseData = [{ name: 'University 1' }, { name: 'University 2' }];
    axios.get.mockResolvedValueOnce({ data: responseData });

    const universities = await getAllUniversities();

    expect(universities).toEqual(responseData);
    expect(axios.get).toHaveBeenCalledWith('http://universities.hipolabs.com/search?country=United%20Arab%20Emirates');
  });

  it('throws an error when the API request fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch data'));

    await expect(getAllUniversities()).rejects.toThrow('Failed to fetch data from API');
  });
});
