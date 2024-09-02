import './App.css';
import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import ChatRoom from './components/Home';
import AppProvider from './Context/AppProvider';
import AuthProvider from './Context/AuthProvider';
import AddRoomModal from './Modals/AddRoomModal';
import InviteMemberModal from './Modals/InviteMemberModal';
import ChangeRoomNameModal from './Modals/ChangeRoomNameModal';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>

          <Routes>
            <Route element={<LoginPage/>} path='/login' />
            <Route element={<ChatRoom/>} path='/' />
          </Routes>

          <AddRoomModal />
          <InviteMemberModal/>
          <ChangeRoomNameModal/>

        </AppProvider>
    </AuthProvider>
  </BrowserRouter>
    
  );
}

export default App;
