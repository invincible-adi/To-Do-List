import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FaLock } from 'react-icons/fa';

// Validation schema with Yup
const schema = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('New password is required'),
});

function ChangePassword() {
  // Hook form setup
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await axiosInstance.put('/changepassword', data);
      Swal.fire({ icon: 'success', title: 'Password changed successfully', showConfirmButton: false, timer: 2000 });
      reset()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Password change failed', text: err.response?.data?.message || 'Error updating password' });
    }
  };

  return (
    <div className="container py-4">
      <div className="card p-4 shadow-lg mx-auto card-gradient blur-background" style={{ maxWidth: 400 }}>
        <h2 className="mb-4 text-primary text-center">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label dark-theme-label">Old Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                id="oldPassword"
                className={`form-control ${errors.oldPassword ? 'is-invalid' : ''} dark-theme-input`}
                type="password"
                {...register("oldPassword")}
                placeholder="Enter old password"
                required
              />
            </div>
            {errors.oldPassword && <div className="invalid-feedback d-block">{errors.oldPassword.message}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label dark-theme-label">New Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                id="newPassword"
                className={`form-control ${errors.newPassword ? 'is-invalid' : ''} dark-theme-input`}
                type="password"
                {...register("newPassword")}
                placeholder="Enter new password"
                required
              />
            </div>
            {errors.newPassword && <div className="invalid-feedback d-block">{errors.newPassword.message}</div>}
          </div>
          <button type="submit" className="btn btn-gradient w-100">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;