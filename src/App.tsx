import { Route, Routes } from 'react-router';
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';


function App() {
 

  return (
    <>
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      
      </Routes>
    </>
  );
}

export default App
