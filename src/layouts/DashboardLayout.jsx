import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { LayoutDashboard, Users, UserCheck, BookOpen, BarChart2 } from 'lucide-react';
import { FiLogOut, FiChevronLeft, FiChevronRight, FiX, FiHome } from 'react-icons/fi';
import avatarImg from '../assets/avatar.png';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/Loading/LoadingScreen';
import logo from "../assets/logo.png"
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
  const { user, logOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop
  // const role = "Admin";
  const { role, roleLoading } = useRole();

  const handleLogOut = () => {
    logOut()
      .then(() => { })
      .catch(err => console.log(err));
  };

  const sidebarLinks = () => {
    if (!user || !role) return []; // <-- safe fallback

    if (role === 'admin') {
      return [
        { label: 'My Profile', to: '/dashboard/profile', icon: <UserCheck size={18} /> },
        { label: 'Add Scholarship', to: '/dashboard/add-scholarship', icon: <BookOpen size={18} /> },
        { label: 'Manage Scholarships', to: '/dashboard/manage-scholarships', icon: <BookOpen size={18} /> },
        { label: 'Manage Users', to: '/dashboard/manage-users', icon: <Users size={18} /> },
        { label: 'Analytics', to: '/dashboard/analytics', icon: <BarChart2 size={18} /> }
      ];
    } else if (role === 'moderator') {
      return [
        { label: 'My Profile', to: '/dashboard/profile', icon: <UserCheck size={18} /> },
        { label: 'Manage Applications', to: '/dashboard/manage-applications', icon: <BookOpen size={18} /> },
        { label: 'All Reviews', to: '/dashboard/reviews', icon: <BookOpen size={18} /> },
      ];
    } else if (role === 'student') {
      return [
        { label: 'My Profile', to: '/dashboard/profile', icon: <UserCheck size={18} /> },
        { label: 'My Applications', to: '/dashboard/my-applications', icon: <BookOpen size={18} /> },
        { label: 'My Reviews', to: '/dashboard/my-reviews', icon: <BookOpen size={18} /> },
      ];
    }

    return []; // fallback
  };

  // Grid columns for sidebar and main content

  const mainColSpan = sidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9';


  if (loading || roleLoading) {
    return <LoadingScreen></LoadingScreen>
  }

  return (

    <div className='max-w-[1600px] mx-auto'>


      <div className="grid grid-cols-12 min-h-screen ">

        {/* Sidebar */}
        <div
          className={`
    bg-white shadow-lg flex flex-col transition-all duration-300 z-50 fixed top-0 left-0 

     inset-y-0 
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

    lg:static lg:translate-x-0
    ${sidebarCollapsed ? "lg:col-span-1" : "lg:col-span-3"}
  `}
        >


          <div className="flex items-center justify-between px-6 h-16 shadow-md">

            {!sidebarCollapsed && <div className='flex items-center gap-2'>
              <div className='w-6 h-6 lg:w-8 lg:h-8'>
                <img className='w-full h-full' src={logo} alt="" />
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-primary">Scholar<span className="text-secondary">Hub</span></h2>
            </div>}
            <div className="flex items-center gap-2">
              <button
                className=" lg:flex text-primary"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <FiChevronRight size={28} /> : <FiChevronLeft size={28} />}
              </button>
              <button
                className="lg:hidden text-primary ml-2"
                onClick={() => setSidebarOpen(false)}
              >
                <FiX size={22} />
              </button>

            </div>
          </div>

          <nav className="mt-6 flex-1 overflow-y-auto px-6">
            <ul className="flex flex-col gap-2 ">
              {/* Sidebar links */}
              {sidebarLinks().map(link => (
    <li key={link.to} className="relative group">
  <NavLink
    to={link.to}
    onClick={() => setSidebarOpen(false)}
         data-tip={`${link.label}`}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-tr-2xl rounded-bl-2xl text-primary font-medium
       hover:bg-secondary/50
       ${isActive ? 'bg-secondary/50' : ''}`
    }
  >
    {link.icon}
    {!sidebarCollapsed && <span>{link.label}</span>}
  </NavLink>

</li>

              ))}

              <li className="mt-4">
                <Link
                  to="/"
              
                  className="flex items-center gap-2 px-3 py-2 rounded-tr-2xl rounded-bl-2xl hover:bg-secondary/50 text-primary font-medium"
                >
                  <FiHome />
                  {!sidebarCollapsed && <span>Back to Home</span>}
                </Link>
              </li>


              <li className="mt-4">
                <Link
                  onClick={handleLogOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-tr-2xl rounded-bl-2xl hover:bg-secondary/50 text-primary font-medium"
                >
                  <FiLogOut />
                  {!sidebarCollapsed && <span>Logout</span>}
                </Link>
              </li>


            </ul>
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className={`col-span-12 ${mainColSpan} flex flex-col w-11/12 mx-auto min-h-screen w-full transition-all duration-300`}>
          <header className="flex items-center justify-between px-6 py-4 h-16 bg-white shadow-md sticky top-0 z-30">
            <button
              className="text-3xl text-primary lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className='flex flex-col items-center'>
              <h1 className="text-2xl font-bold text-primary capitalize">{role} Dashboard</h1>
              <h2>Welcome {user.displayName}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary">
                <img src={user?.photoURL || avatarImg} alt="User Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

    </div>

  );
};

export default DashboardLayout;
