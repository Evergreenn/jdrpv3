import { BrowserRouter, Route, Switch, Link, NavLink } from 'inferno-router';
import Home from './pages/home';
import About from './pages/about';
import Login from './pages/login'

const App = () => {

  const authenticated = false;


  return <BrowserRouter>

    <nav className="nav">
      <div className="nav-left">
        <a className="brand" href="#">Sigil of Baphomet</a>
        <div className="tabs">
          <NavLink exact={true} activeClassName='active' to='/'><a>Home</a></NavLink>
          <NavLink activeClassName='active' to='/about'><a>About</a></NavLink>
        </div>
      </div>
      <div className="nav-right">
        {/* <Link to="/login"><a class="button outline">Login</a></Link> */}
        {!authenticated &&
          <a className="button outline" href="">Login</a>}
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

    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
    </Switch>

  </BrowserRouter>

};

export default App;