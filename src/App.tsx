import React from 'react';
import './App.css';
import ConnectPhantomWallet from './components/ConnectPhantomWallet';
import K3K from './components/K3K';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana WebApp</h1>
        <ConnectPhantomWallet/>
      </header>
    </div>
  );
}

export default App;
