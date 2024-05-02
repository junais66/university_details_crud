import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

function DetailsPage() {
  
  const location = useLocation();
  let navigate = useNavigate();
  const { data } = location.state || {};

  function handleClickBack() {
    navigate('/');
  }
  const university = data;
  if (!university) {
    return <div>University details not found.</div>;
  }

  return (
    <div className="container">
      <h2>University Details</h2>
      <div className="card">
      <h1>{university.name}</h1>
      <p>Country: {university.country}</p>
      <p>State/Province: {university['state-province'] || 'N/A'}</p>
      <p>Website: <a href={university.web_pages[0]} target="_blank" rel="noopener noreferrer">{university.web_pages[0]}</a></p>
      <button onClick={handleClickBack} className='back-button'>Back</button>    
      </div>
    </div>
  );
}



export default DetailsPage;
