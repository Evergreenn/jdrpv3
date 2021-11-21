import React from 'react';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Login from './pages/login'
import AccountCreation from './pages/accountcreation';
import NavRight from './components/security/navright';
import DarkMode from './components/UI/darkmode';

const App = () => {

  return (
    <>
      <BrowserRouter>
        <nav className="nav">
          <div className="nav-left">
            <a className="brand">Anima Sola</a>
            <div className="tabs">
              <NavLink activeclassname='active' to='/'><a>Home</a></NavLink>
              <NavLink activeclassname='active' to='/about'><a>About</a></NavLink>
            </div>
          </div>
          <div className="nav-right">
            <DarkMode />
            <NavRight />
          </div>
        </nav>

        <Routes>
          <Route exact path="/" element={Home} />
          <Route path="/about" element={About} />
          <Route path="/login" element={Login} />
          <Route path="/create-account" element={AccountCreation} />
        </Routes>

      </BrowserRouter>
    </>

  )

};

export default App;