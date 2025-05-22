import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const schema = yup.object().shape({
    password: yup.string().min(8, 'Password must be at least 8 characters').max(8).required('Password is required'),
});

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Password is required' });
            return;
        }

        try {
            await schema.validate({ password }, { abortEarly: false });
            setErrors({});

            // const token = localStorage.getItem('token');
            const reset = await axios.put(`http://localhost:5000/resetpassword`, { token, password });

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
        <div className="container d-flex align-items-center justify-content-center mt-5">
            <div className="card p-4 shadow-lg" style={{ width: '50%' }}>
                <h2 className="mb-4 text-primary text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                </form>
                {success && <div className="alert alert-success mt-3 text-center">{success}</div>}
            </div>
        </div>
    );
}

export default ResetPassword;
