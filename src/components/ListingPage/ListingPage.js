import React, { useState, useEffect } from 'react';
import { getAllUniversities } from '../../services/ApiService';
import Loader from '../common/Loader';
import { Link } from 'react-router-dom';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/LocalStorageUtil'; // Import local storage utility functions


function ListingPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedUniversities, setDisplayedUniversities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const pageSize = 10; // Number of items per page

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllUniversities();
        setUniversities(data);
        setDisplayedUniversities(data.slice(0, pageSize)); // Display first page
        setLoading(false);
        // Cache the data in local storage
        saveToLocalStorage('universities', data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Data fetching failed, please check your internet connection...');
        setLoading(false);
        // Attempt to retrieve data from local storage
        const cachedData = getFromLocalStorage('universities');
        if (cachedData) {
          setUniversities(cachedData);
          setDisplayedUniversities(cachedData.slice(0, pageSize));
        }
      }
    }
    fetchData();
  }, []);
  
  const totalPages = Math.ceil(universities.length / pageSize);

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedUniversities(universities.slice(startIndex, endIndex));
    setCurrentPage(page); // Update currentPage state
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Filter universities based on search term
    const filteredUniversities = universities.filter(university =>
      university.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setDisplayedUniversities(filteredUniversities.slice(0, pageSize));
    setCurrentPage(1); // Reset currentPage when performing a new search
  };

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const handleDelete = (name) => {
    const updatedUniversities = universities.filter(university => university.name !== name);
    setUniversities(updatedUniversities);  // Update the main list
    const startIndex = (currentPage - 1) * pageSize;
    
    // Update displayed list
    setDisplayedUniversities(updatedUniversities.slice(startIndex, startIndex + pageSize));  
    
    // If the page becomes empty and it's not the first page, go back to the previous page
    if ((currentPage > 1) && (startIndex >= updatedUniversities.length)) {
      setCurrentPage(currentPage - 1);
    }
  };
  

  const sortedUniversities = sortBy ? [...displayedUniversities].sort((a, b) => {
    const keyA = a[sortBy];
    const keyB = b[sortBy];
    if (keyA < keyB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (keyA > keyB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  }) : displayedUniversities;

  return (
    <div className="container">
       <h1>University Listing</h1>
       <p className='error-msg'>{error && error}</p>
      <div className="search-container">
      <input 
          type="text" 
          className="search-input"
          placeholder="Search by university name..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="university-table-container fade-in">
            <table className="university-table">
              {/* Table header */}
              <thead>
              <tr>
              <th className="table-header" onClick={() => handleSort('name')}>
                Name
                {sortBy === 'name' && (
                  <span className="sorting-icon"></span>
                )}
              </th>
              <th className="table-header" onClick={() => handleSort('country')}>
                Country
                {sortBy === 'country' && (
                  <span className="sorting-icon"></span>
                )}
              </th>
              <th>Action</th>
            </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {sortedUniversities.map((university, index) => (
                  <tr key={university.id} className="table-row">
                   <td>
                   <Link to="/details" state={{ data: university }}>{university.name}</Link>
                    </td>
                    <td>{university.country}</td>
                    <td>
                    <button className="delete-button"
                      onClick={() => handleDelete(university.name)}>
                      x
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pager */}
          <div className="pager fade-in">
            <button
              className="pager-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              className="pager-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ListingPage;
