import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

// Validation schema with Yup
const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
});

function ResetPassword() {
    // Hook form setup
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            await axios.post('http://localhost:5000/resetpassword', data);
            Swal.fire({ icon: 'success', title: 'Reset link sent! Check your email', showConfirmButton: false, timer: 2000 });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to send reset link', text: err.response?.data?.message || 'Reset request failed' });
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center m-5">
            <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: '100%' }}>
                <h2 className="mb-4 text-primary text-center">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;