import React from "react"
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Homepage from './Pages/Homepage';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Error from "./Pages/Error"
import Navbar from './Pages/Navbar';
import ProtectedRoutes  from './Pages/ProtectedRoutes';
import Content from './Pages/Content';
import Edit from "./Pages/Edit";



function App() {
  const Token = localStorage.getItem("token")
  
  return (
      
      <BrowserRouter>
        <Navbar/>
        <Routes>
        
         <Route exact  path='/' element={<Homepage/>}/>
         <Route exact path='/registration' element={<Registration/>}/>
         <Route exact  path='/login' element={<Login/>}/>
         <Route exact path="*" element={<ProtectedRoutes />}>
            <Route exact path="*" element={<Content> </Content>} />
            
          </Route>
          <Route exact  path='/edit' element={<Edit/>}/>
         
         <Route  path='/*' element={<Error/>}/>
         
        
        </Routes>
        
       
        
      </BrowserRouter>


   
  );
}

export default App;
