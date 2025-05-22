import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

// Validation schema with Yup
const schema = yup.object().shape({
    name: yup.string().required('UserName is required').max(12),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').max(8).required('Password is required'),
});

function Register() {
    const navigate = useNavigate();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            await axios.post('http://localhost:5000/register', data);
            Swal.fire({ icon: 'success', title: 'Registration successful', showConfirmButton: false, timer: 1500 });
            navigate('/');
        } catch (err) {
            console.log(err);
            Swal.fire({ icon: 'error', title: 'Registration failed', text: err.response?.data?.message || 'Registration failed' });
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center mt-5">
            <div className="card p-4 shadow-lg" style={{ width: '50%' }}>
                <h2 className="mb-4 text-primary text-center">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            type="text"
                            {...register("name")}
                            placeholder="UserName"
                            required
                        />
                        {errors.name && <p className="text-danger">{errors.name.message}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            className={`form-control`}
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            required
                        />
                        {errors.email && <div className="texxt-danger">{errors.email.message}</div>}
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
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    <div className="mt-3 text-center">
                        <p>Already have an account? <Link to="/">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;