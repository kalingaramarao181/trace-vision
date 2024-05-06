import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Admin from './components/Admin'
import Barchats from './components/Barchart';
import Login from './components/Login';
import Secure from './components/Secure';
import Demo from './components/Demo';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/' exact component={Home} />
        <Secure path='/admin' exact component={Admin} />
        <Route path='/barchart' exact component={Barchats} />
        <Route path="/login" exact component={Login} />
        <Route path="/demo" exact component={Demo} />

      </Switch>
    </BrowserRouter>
  );
}

export default App;
