import React from 'react'
import { NavLink } from 'react-router-dom'
import { isUserLoggedIn, logout } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'

const HeaderComponent = () => {

    const isAuth = isUserLoggedIn();
    const role = localStorage.getItem('role');
    const isAdmin = role === 'TEACHER' || role === 'ADMIN';
    const isStudent = role === 'STUDENT';

    const navigator = useNavigate();

    function handleLogout(){
        logout();
        navigator('/login')
    }

  return (
    <div>
        <header>
            <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
                <div>
                    <a href='http://localhost:3001' className='navbar-brand'>
                        School Equipment Lending Portal
                    </a>
                </div>
                <div className='collapse navbar-collapse'>
                    <ul className='navbar-nav'>

                        {
                            isAuth &&
                            <li className='nav-item'>
                            <NavLink to="/equipment" className="nav-link">Equipment</NavLink>
                        </li>
                        }

                        {
                            isAuth && isStudent &&
                            <li className='nav-item'>
                                <NavLink to="/my-requests" className="nav-link">Borrow Requests</NavLink>
                            </li>
                        }


                        {
                            isAuth && isAdmin &&
                            <li className='nav-item'>
                            <NavLink to="/admin-requests" className="nav-link">Manage Requests</NavLink>
                        </li>
                        }

                    </ul>

                </div>
                <ul className='navbar-nav'>
                    {
                        !isAuth &&                         
                        <li className='nav-item'>
                        <NavLink to="/register" className="nav-link">Register</NavLink>
                    </li>
                    }

                    {
                        !isAuth &&    
                        <li className='nav-item'>
                        <NavLink to="/login" className="nav-link">Login</NavLink>
                    </li>
                    }

                    {
                        isAuth &&    
                        <li className='nav-item'>
                        <NavLink to="/login" className="nav-link" onClick={handleLogout}>Logout</NavLink>
                    </li>
                    }

                    </ul>
            </nav>
        </header>

    </div>
  )
}

export default HeaderComponent