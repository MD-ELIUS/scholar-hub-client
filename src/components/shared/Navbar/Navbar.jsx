import React, { useState } from 'react';
import logo from '../../../assets/logo.png'
import NavLinkItem from './NavLinkItem';
import AvatarDropdown from './AvatarDropdown';
import { CgClose, CgMenuGridR } from 'react-icons/cg';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';
import useRole from '../../../hooks/useRole';

const Navbar = () => {
    const {user} = useAuth() ;
    const [open, setOpen] = useState(false); 
    const renderLinks =
  <>
   <li><NavLinkItem onClick={() => setOpen(false)} to="/" label="Home" /></li>
<li><NavLinkItem onClick={() => setOpen(false)} to="/all-scholarships" label="All Scholarships" /></li>

  </>
;

    return (
        <div className='max-w-11/12 mx-auto flex justify-between items-center py-1 md:py-2'>
            <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 md:w-10 md:h-10 '>
                <img className='w-full h-full' src={logo} alt="" />
            </div>
            <div>
                <h4 className='text-2xl md:text-3xl font-bold text-primary'>Scholar<span className='text-secondary'>Hub</span></h4>
            </div>
            </div>

            <navbar className="bg-secondary text-sm  font-medium pt-1 pb-2 px-10 shadow-md rounded-bl-2xl rounded-tr-2xl hidden lg:flex">
                  <ul className='flex items-center  gap-4'>
                       {renderLinks}
                  </ul>
                      
                    
            </navbar>


               {/* Hamburger Button - Mobile */}
            <div className='lg:hidden'>
                <button
                    onClick={() => setOpen(!open)}
                    className='text-3xl mt-2 text-primary focus:outline-none cursor-pointer'
                >
                    {open ? <CgClose /> : <CgMenuGridR />}
                </button>
            </div>

            {/* Mobile Menu */}
<div className={`absolute left-2 right-1/2 top-9.5 my-4 max-w-48 bg-secondary shadow-lg rounded-bl-2xl rounded-tr-2xl
  transition-all duration-200
  ${open ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 pointer-events-none"} lg:hidden`}
>
  <ul className='flex flex-col gap-2 font-medium  text-white py-2 mx-2'>
    {renderLinks} {/* Close menu on link click */}
  </ul>
</div>



            {
                user ? <div className=" ">
  <AvatarDropdown onClick={() => setOpen(true)} />
</div>
    :
    <div className='flex gap-4'>
  <Link to='/login' className='btn btn-primary px-2 py-1 text-black hover:text-white btn-outline rounded-bl-2xl rounded-tr-2xl flex items-center gap-2'>
    <FiLogIn />
    Login
  </Link>
  <Link to='/register' className='btn btn-secondary px-2 py-1 text-black hover:text-white btn-outline rounded-bl-2xl rounded-tr-2xl lg:flex hidden flex items-center gap-2'>
   <FiUserPlus />
    Register
  </Link>
</div>
            }

            

          

           
        </div>
    );
};

export default Navbar;