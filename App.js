import React, {useState, useEffect} from 'react';
import './App.css';
import PathfindingVisualizers from './PathfindingVisualizers';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.text())
      //.then(text => console.log(text))
      
      //.then((res) => res.json())
      .then((data) => setData(data.message))
  }, []);

  return (
    <div className = 'App'>
      <PathfindingVisualizers></PathfindingVisualizers>
    </div>
  );
};

export default App;