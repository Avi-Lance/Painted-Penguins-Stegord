import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
// Uncomment for backend

import { Amplify, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from '../aws-exports';
import store from '../redux/store';

Amplify.configure(awsExports);

export default function App() {
  return (
    <Authenticator>
      <Provider store={store}>
        <main>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </main>
      </Provider>
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
