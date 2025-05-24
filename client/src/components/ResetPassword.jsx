import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FaLock } from 'react-icons/fa';

const schema = yup.object().shape({
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
        .required('New password is required'),
});

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await schema.validate({ password }, { abortEarly: false });
            setErrors({});

            // const token = localStorage.getItem('token');
            const reset = await axiosInstance.put(`/resetpassword`, { token, password });

            console.log(reset);
            Swal.fire({ icon: 'success', title: 'Password reset successful', showConfirmButton: false, timer: 1500 });
            setSuccess('Password reset successful');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setSuccess('');
            Swal.fire({ icon: 'error', title: 'Password reset failed', text: err.response?.data?.message || 'Password reset failed' });
        }
    };

    return (
        <div className="container py-4">
            <div className="card p-4 shadow-lg mx-auto card-gradient blur-background" style={{ maxWidth: 400 }}>
                <h2 className="mb-4 text-primary text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label dark-theme-label">New Password</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaLock /></span>
                            <input
                                id="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''} dark-theme-input`}
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-gradient w-100">Reset Password</button>
                </form>
                {success && <div className="alert alert-success mt-3 text-center">{success}</div>}
            </div>
        </div>
    );
}

export default ResetPassword;
