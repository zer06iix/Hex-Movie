import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/app/navigation/Navbar';
import Home from './pages/Home';
import MostRated from './pages/MostRated';
import Watchlist from './pages/Watchlist';
import MoviePage from './pages/MoviePage';
import ShowsPage from './pages/ShowsPage';
import CastPage from './pages/CastPage';
import ResultsPage from './pages/SearchResultsPage';

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/" element={<Home />} />
                    <Route path="/most-rated" element={<MostRated />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/movie/:id" element={<MoviePage />} />
                    <Route path="/shows/:id" element={<ShowsPage />} />
                    <Route path="/cast/:id" element={<CastPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
