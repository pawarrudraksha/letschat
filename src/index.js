import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import GroupContextProvider from './context/GroupContext';
import { UsersContextProvider } from './context/UsersContext';
import { SearchMessageContextProvider } from './context/SearchMessageContext';
import { HomeContextProvider } from './context/HomeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <ChatContextProvider>
    <GroupContextProvider>
      <UsersContextProvider>
        <SearchMessageContextProvider>
          <HomeContextProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </HomeContextProvider>
        </SearchMessageContextProvider>
      </UsersContextProvider>
    </GroupContextProvider>
  </ChatContextProvider>
  </AuthContextProvider>
);


