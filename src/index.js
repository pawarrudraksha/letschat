import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import GroupContextProvider from './context/GroupContext';
import { UsersContextProvider } from './context/UsersContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <ChatContextProvider>
    <GroupContextProvider>
      <UsersContextProvider>

    <React.StrictMode>
      <App />
    </React.StrictMode>
      </UsersContextProvider>
    </GroupContextProvider>
  </ChatContextProvider>
  </AuthContextProvider>
);


