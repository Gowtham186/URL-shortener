import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useContext } from 'react';
import AuthContext from './contexts/AuthContext';
import MyUrls from './pages/MyUrls';
import UrlAnalytics from './pages/UrlAnalytics';
import RedirectHandler from './pages/RedirectHandler';

function App() {
  const { userState, handleLogout } = useContext(AuthContext)
  const navigate = useNavigate()
  return (
    <div className="App">
      <h1>url</h1>
      <ul>
        {userState.isLoggedIn ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/myurls">MyUrls</Link></li>
            <li><button onClick={()=>{
              handleLogout()
              localStorage.removeItem('token')
              navigate('/login')
            }}>Logout</button></li>
            
          </>
        ) : (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          
          </>
        )}
        
        
      </ul>

      <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/myurls' element={<MyUrls />}/>
        <Route path='/analytics/:id' element={<UrlAnalytics />}/>
        <Route path='/:shortUrl' element={<RedirectHandler />}/>
      </Routes>
    </div>
  );
}

export default App;
