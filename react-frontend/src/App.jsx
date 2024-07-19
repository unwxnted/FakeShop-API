import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Products from './components/Products'
import Signup from './components/Signup'

function App() {

  return (
    <div className='bg-dark'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home className="bg-dark" />} />
          <Route path="/products" element={<Products className="bg-dark" />} />
          <Route path="/cart" element={<Home className="bg-dark" />} />
          <Route path="/signup" element={<Signup className="bg-dark" />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
