import React from 'react'
import Footer  from '../Footer/Footer.jsx';
import { Outlet } from 'react-router-dom';
import Navbar  from '../Navbar/Navbar.jsx';

export default function Layout() {
  return <>
    <div className="pt-5">
      <Navbar/>
      <div className='mt-15 min-h-[40vh]'>
        <Outlet></Outlet>
      </div>
      <Footer/>
    </div>
  </>
}