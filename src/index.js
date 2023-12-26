import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import GroupContextProvider from './context/GroupContext';
import { UsersContextProvider } from './context/UsersContext';
import { SearchMessageContextProvider } from './context/SearchMessageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <ChatContextProvider>
    <GroupContextProvider>
      <UsersContextProvider>
        <SearchMessageContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
        </SearchMessageContextProvider>
      </UsersContextProvider>
    </GroupContextProvider>
  </ChatContextProvider>
  </AuthContextProvider>
);


