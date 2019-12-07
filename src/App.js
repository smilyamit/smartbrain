import React from 'react';
import Navigation from './components/Navigation/Navigation';
import logo from './components/Logo/Logo';
import './App.css';

function App() {
  return (
    <div className="App">
     <Navigation/>
     <logo/>
     {/*<ImageLinkForm/>
     <FaceRecognization/>*/}
    </div>
  );
}

export default App;
