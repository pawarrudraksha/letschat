import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Link,
  BrowserRouter,
  Routes,
  Navigate,
} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route index element={<Home/>}/>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
);

function App() {
  const {currentUser}=useContext(AuthContext)
  const ProtectedRoute=({children})=>{
    if(!currentUser){
      return <Navigate to="/login"/>
    }else{
      return children
    }
  }
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" >
      <Route index element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
      </Routes>
    </BrowserRouter>
    );
}

export default App;
