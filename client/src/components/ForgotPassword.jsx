import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FaEnvelope } from 'react-icons/fa';

// Validation schema with Yup
const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
});

function ForgotPassword() {
    // Hook form setup
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            await axiosInstance.post('/forgotpassword', data);
            Swal.fire({ icon: 'success', title: 'Check your email for reset instructions', showConfirmButton: false, timer: 2000 });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to send reset link', text: err.response?.data?.message || 'Failed to send reset link' });
        }
    };

    return (
        <div className="container py-4">
            <div className="card p-4 shadow-lg mx-auto card-gradient blur-background" style={{ maxWidth: 400 }}>
                <h2 className="mb-4 text-primary text-center">Forgot Password</h2>
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
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-gradient w-100">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;