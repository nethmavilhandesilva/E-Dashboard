import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Nav from './Nav'; // Make sure the path is correct


function App() {
  return (
    <div className="App">
    <BrowserRouter> 
      <Nav />
     <h1>E-Dashboard</h1>
     </BrowserRouter>
    </div>
  );
}

export default App;
