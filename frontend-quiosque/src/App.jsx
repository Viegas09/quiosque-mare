import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Contas from './pages/Contas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/contas" element={<Contas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
