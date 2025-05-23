import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';

// Validation schema with Yup
const schema = yup.object().shape({
    name: yup.string().required('Name is required').max(12),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    age: yup.number().typeError('Age must be a number').required('Age is required').min(1, 'Age must be at least 1'),
    dateOfBirth: yup.date().typeError('Date of Birth is required').required('Date of Birth is required'),
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
        <div className="container py-4">
            <div className="card p-4 shadow-lg mx-auto card-gradient blur-background" style={{ maxWidth: 400 }}>
                <h2 className="mb-4 text-primary text-center">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label dark-theme-label">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaUser /></span>
                            <input
                                className={`form-control ${errors.name ? 'is-invalid' : ''} dark-theme-input`}
                                type="text"
                                {...register("name")}
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        {errors.name && <div className="invalid-feedback text-danger d-block">{errors.name.message}</div>}
                    </div>
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
                        {errors.email && <div className="invalid-feedback text-danger d-block">{errors.email.message}</div>}
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
                        {errors.password && <div className="invalid-feedback text-danger">{errors.password.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="age" className="form-label dark-theme-label">Age</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaBirthdayCake /></span>
                            <input
                                id="age"
                                className={`form-control ${errors.age ? 'is-invalid' : ''} dark-theme-input`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                {...register("age")}
                                placeholder="Age"
                                required
                            />
                        </div>
                        {errors.age && <div className="invalid-feedback text-danger">{errors.age.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label dark-theme-label">Date of Birth</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaCalendarAlt /></span>
                            <input
                                id="dateOfBirth"
                                className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''} dark-theme-input`}
                                type="date"
                                {...register("dateOfBirth")}
                                placeholder="Date of Birth"
                                required
                            />
                        </div>
                        {errors.dateOfBirth && <div className="invalid-feedback text-danger">{errors.dateOfBirth.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-gradient w-100">Register</button>
                    <div className="mt-3 text-center">
                        <p className="text-white">Already have an account? <Link to="/" className="text-decoration-none" style={{ color: 'var(--dark-primary)' }}>Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;