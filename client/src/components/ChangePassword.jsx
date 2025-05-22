import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

// Validation schema with Yup
const schema = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
});

function ChangePassword() {
  const token = localStorage.getItem('token');

  // Hook form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await axios.put('http://localhost:5000/changepassword', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: 'success', title: 'Password changed successfully', showConfirmButton: false, timer: 2000 });
      reset()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Password change failed', text: err.response?.data?.message || 'Error updating password' });
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <div className="card p-4 shadow-lg" style={{ width: '50%' }}>
        <h2 className="mb-4 text-primary text-center">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
              type="password"
              {...register("oldPassword")}
              placeholder="Enter old password"
              required
            />
            {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword.message}</div>}
          </div>
          <div className="mb-3">
            <input
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
              required
            />
            {errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;