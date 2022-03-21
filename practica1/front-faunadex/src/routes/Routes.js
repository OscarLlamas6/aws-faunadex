import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import EditProfile from "../pages/EditProfile";
import UploadPic from "../pages/UploadPic";
import EditAlbum from "../pages/EditAlbum";
import ViewPic from "../pages/ViewPic";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/editprofile' element={<EditProfile/>} />
        <Route path='/uploadpic' element={<UploadPic/>} />
        <Route path='/editalbum' element={<EditAlbum/>} />
        <Route path='/viewpic' element={<ViewPic/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;