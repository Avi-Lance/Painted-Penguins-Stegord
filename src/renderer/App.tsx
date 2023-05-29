import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';

// Uncomment for backend
/*
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Dashboard>
          <h1>Hello {user?.username}</h1>
          <p>Hello World</p>
          <button onClick={signOut}>Sign out</button>
        </Dashboard>
      )}
    </Authenticator>
  );
}
*/
// Comment this when using backend
export default function App() {
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}
