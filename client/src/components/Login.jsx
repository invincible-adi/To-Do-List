import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// Validation schema with Yup
const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

function Login() {
    const navigate = useNavigate();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            const res = await axiosInstance.post('/login', data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userid', res.data.user.id);

            Swal.fire({ icon: 'success', title: 'Login successful', showConfirmButton: false, timer: 1500 });
            navigate(`/dashboard`);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Login failed', text: err.response?.data?.message || 'Login failed' });
        }
    };

    return (
        <div className="container py-4">
            <div className="card p-4 shadow-lg mx-auto card-gradient blur-background" style={{ maxWidth: 400 }}>
                <h2 className="mb-4 text-primary text-center">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label dark-theme-label">Email address</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaEnvelope /></span>
                            <input
                                id="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''} dark-theme-input`}
                                type="email"
                                {...register("email")}
                                placeholder="Email"
                                required
                            />
                        </div>
                        {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label dark-theme-label">Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaLock /></span>
                            <input
                                id="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''} dark-theme-input`}
                                type="password"
                                {...register("password")}
                                placeholder="Password"
                                required
                            />
                        </div>
                        {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-gradient w-100">Login</button>
                    <div className="mt-3 d-flex justify-content-between">
                        <p className="text-center w-100 text-white">Don't have an account? <Link to="/register" className="text-decoration-none" style={{ color: 'var(--dark-primary)' }}>Register</Link></p>
                    </div>
                    <div className="text-center mt-2">
                        <Link to="/forgot-password" className="text-decoration-none dark-theme-text" style={{ color: 'var(--dark-primary)' }}>Forgot Password</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;