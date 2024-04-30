import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Admin from './components/Admin'
import Barchats from './components/Barchart';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/admin' exact component={Admin} />
        <Route path='/barchart' exact component={Barchats} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
