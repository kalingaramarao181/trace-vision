import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Admin from './components/Admin'

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/admin' exact component={Admin} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
