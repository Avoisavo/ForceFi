import { BrowserRouter, Routes, Route } from 'react-router-dom';
import YourPage from './pages/hallo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/hallo" element={<YourPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;