import { BrowserRouter, Route, Switch, Link } from 'inferno-router';
import Home from './pages/home';
import About from './pages/about';

const App = () => {
  return <BrowserRouter>

    <nav class="nav">
      <div class="nav-left">
        <a class="brand" href="#">Brand</a>
        <div class="tabs">
          <a class="active"><Link to="/">Home</Link></a>
          <a><Link to="/about">About</Link></a>
        </div>
      </div>
      <div class="nav-right">
        <a class="button outline">Button</a>
      </div>
    </nav>

    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>

  </BrowserRouter>

};

export default App;