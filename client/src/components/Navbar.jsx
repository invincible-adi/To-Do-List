import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand text-primary fw-bold fs-3" to="/">To Do List</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse fs-5" id="navbarNav">
                    <ul className="navbar-nav ms-auto ">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link me-3" to={`/dashboard`}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link me-3" to={`/changepassword`}>Change Password</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger mt-1" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link me-3" to="/register">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary fs-5" to="/">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;