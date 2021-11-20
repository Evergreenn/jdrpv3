import React from 'react';
import { BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Login from './pages/login'
import AccountCreation from './pages/accountcreation';

const App = () => {

  const authenticated = false;

  return(

      <BrowserRouter>
        <nav className="nav">
          <div className="nav-left">
            <a className="brand">Sigil of Baphomet</a>
            <div className="tabs">
              <NavLink activeclassname='active' to='/'><a>Home</a></NavLink>
              <NavLink activeclassname='active' to='/about'><a>About</a></NavLink>
            </div>
          </div>
          <div className="nav-right">
            {/* <Link to="/login"><a class="button outline">Login</a></Link> */}
            {!authenticated &&
              <NavLink activeclassname='active' to='/login'>
                <a className="button outline">Login</a>
              </NavLink>
            }
            {authenticated &&
              <details className="dropdown">
                <summary className="button outline">Username</summary>
                <div className="card">
                  <a onClick={() => alert("account")} >Account</a>
                  <a onClick={() => alert("logout")} >Logout</a>
                </div>
              </details>
            }
          </div>
        </nav>

        <Routes>
          <Route exact path="/" element={Home} />
          <Route path="/about" element={About} />
          <Route path="/login" element={Login} />
          <Route path="/create-account" element={AccountCreation} />
        </Routes>

      </BrowserRouter>

  )

};

export default App;