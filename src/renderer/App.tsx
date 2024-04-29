import React from 'react';
import { createRoot } from 'react-dom/client';

function landing() {

  const chromeVersion = window.versions.chrome()
  const nodeVersion = window.versions.node()
  const elecVersion = window.versions.electron()
  const ping = "waiting for ping"
  return (
    <div>
      <h2>💖 Hello from React!</h2>
      <p>
      This app is using Chrome ({chromeVersion}), Node.js ({nodeVersion}), and Electron ({elecVersion})
      </p>
      {ping}
    </div>
  );
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(landing())

import './App.css';
