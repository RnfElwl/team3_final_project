import React from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
// import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
      <div id = "SceneNumber">
        <Header/>
          <Outlet/>
        <Footer/>
      </div>

  );
}

export default Layout;