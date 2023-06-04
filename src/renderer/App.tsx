import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';

// Uncomment for backend

import { Amplify, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from '../aws-exports';

Amplify.configure(awsExports);

const userdata = await Auth.currentUserInfo();

export default function App() {
  window.electron.ipcRenderer.sendMessage(
    'configureBackend',
    userdata.username
  );

  return (
    <Authenticator>
      {({ user }) => (
        <main>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </main>
      )}
    </Authenticator>
  );
}

// Comment this when using backend
/*
export default function App() {
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}
*/
