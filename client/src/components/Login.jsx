import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

// Validation schema with Yup
const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(8, 'Password must be exactly 8 characters').max(8, 'Password must be exactly 8 characters').required('Password is required'),
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
            const res = await axios.post('http://localhost:5000/login', data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userid', res.data.user.id);

            Swal.fire({ icon: 'success', title: 'Login successful', showConfirmButton: false, timer: 1500 });
            navigate(`/dashboard`);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Login failed', text: err.response?.data?.message || 'Login failed' });
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center mt-5">
            <div className="card p-4 shadow-lg" style={{ width: '50%' }}>
                <h2 className="mb-4 text-primary text-center">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="mt-3 d-flex justify-content-between">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                        <p><Link to="/forgot-password">Forgot Password</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;