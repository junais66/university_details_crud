import { Routes, Route } from "react-router-dom";
import ListingPage from './components/ListingPage/ListingPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import Navbar from './components/NavBar/NavBar';
import './styles/style.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListingPage />} />
        <Route path="/details" element={<DetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
