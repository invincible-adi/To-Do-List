import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, profileUpdated } = useAuth();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [loadingProfileImage, setLoadingProfileImage] = useState(false);
    const [hasProfileImage, setHasProfileImage] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchProfileImage = async () => {
                setLoadingProfileImage(true);
                try {
                    const res = await axiosInstance.get('/profile');
                    const imageUrl = res.data.user.profileImageUrl;
                    if (imageUrl) {
                        setProfileImageUrl(`http://localhost:5000${imageUrl}`);
                        setHasProfileImage(true);
                    } else {
                        setProfileImageUrl(null);
                        setHasProfileImage(false);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile image:', error);
                    setProfileImageUrl(null);
                    setHasProfileImage(false);
                } finally {
                    setLoadingProfileImage(false);
                }
            };
            fetchProfileImage();
        } else {
            setProfileImageUrl(null);
            setHasProfileImage(false);
        }
    }, [isAuthenticated, profileUpdated]);

    return (
        <nav className="navbar navbar-expand-lg navbar-gradient">
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
                                {loadingProfileImage ? (
                                    <li className="nav-item me-3 d-flex align-items-center">
                                        <div style={{ width: 35, height: 35, borderRadius: '50%', backgroundColor: '#555' }}></div>
                                    </li>
                                ) : (
                                    <li className="nav-item me-3 d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                        <Link to="/profile" className="nav-link p-0 d-flex align-items-center">
                                            {hasProfileImage && profileImageUrl ? (
                                                <img
                                                    src={profileImageUrl}
                                                    alt="Profile"
                                                    style={{
                                                        width: 35,
                                                        height: 35,
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '1px solid white'
                                                    }}
                                                />
                                            ) : (
                                                <FaUserCircle size={30} />
                                            )}
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-danger mt-1" onClick={logout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link me-3" to="/register">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-danger fs-5" to="/">Login</Link>
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