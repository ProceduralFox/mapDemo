import { useState } from 'react';
import './App.css';
import MapComponent from './components/Map';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app">
        <MapComponent></MapComponent>
      </div>
    </>
  );
}

export default App;
