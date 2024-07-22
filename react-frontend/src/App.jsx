import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Products from './components/Products'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Cart from './components/Cart'
import Admin from './components/Admin'

function App() {

  return (
    <div className='bg-dark'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home className="bg-dark" />} />
          <Route path="/products" element={<Products className="bg-dark" />} />
          <Route path="/cart" element={<Cart className="bg-dark" />} />
          <Route path="/signup" element={<Signup className="bg-dark" />} />
          <Route path="/signin" element={<Signin className="bg-dark" />} />
          <Route path="/admin" element={<Admin className="bg-dark" />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
