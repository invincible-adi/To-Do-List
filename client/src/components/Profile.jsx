import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Swal from 'sweetalert2';
import withAuth from '../auth/withAuth';
import Modal from 'react-bootstrap/Modal';
import { FaUser, FaEnvelope, FaBirthdayCake, FaCalendarAlt, FaEdit, FaLock } from 'react-icons/fa';
import { BiImageAdd } from 'react-icons/bi';

function Profile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ name: '', age: '', dateOfBirth: '', profileImage: null });
    const [preview, setPreview] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get('/profile');
            setUser(res.data.user);
            setForm({
                name: res.data.user.name || '',
                age: res.data.user.age || '',
                dateOfBirth: res.data.user.dateOfBirth ? res.data.user.dateOfBirth.substr(0, 10) : '',
                profileImage: null
            });
            setPreview(res.data.user.profileImageUrl || null);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to fetch profile' });
        }
    };

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
        setForm({
            name: user.name || '',
            age: user.age || '',
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substr(0, 10) : '',
            profileImage: null
        });
        setPreview(user.profileImageUrl || null);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage' && files.length > 0) {
            setForm(f => ({ ...f, profileImage: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('age', form.age);
            formData.append('dateOfBirth', form.dateOfBirth);
            if (form.profileImage) formData.append('profileImage', form.profileImage);
            await axiosInstance.put('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({ icon: 'success', title: 'Profile updated successfully', timer: 1200 });
            setEditMode(false);
            fetchProfile();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Update failed', text: error.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setChangingPassword(true);
        try {
            await axiosInstance.put('/changepassword', { oldPassword, newPassword });
            Swal.fire({ icon: 'success', title: 'Password changed successfully', timer: 1500 });
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Password change failed', text: err.response?.data?.message || 'Error updating password' });
        } finally {
            setChangingPassword(false);
        }
    };

    if (!user) return <div className="container mt-5 text-center">Loading...</div>;

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <div className="card p-4 shadow-lg card-gradient blur-background">
                <h2 className="mb-4 text-primary text-center">Profile</h2>
                <div className="text-center mb-3">
                    <img
                        src={preview ? `http://localhost:5000${preview}` : '/default-profile.png'}
                        alt="Profile"
                        style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--dark-border-color)' }}
                    />
                </div>
                {!editMode ? (
                    <>
                        <div className="mb-2 text-danger"><strong className="me-2 text-secondary">Name:</strong> {user.name}</div>
                        <div className="mb-2 text-danger"><strong className="me-2 text-secondary">Username:</strong> {user.username}</div>
                        <div className="mb-2 text-danger"><strong className="me-2 text-secondary">Email:</strong> {user.email}</div>
                        <div className="mb-2 text-danger"><strong className="me-2 text-secondary">Age:</strong> {user.age}</div>
                        <div className="mb-2 text-danger"><strong className="me-2 text-secondary">Date of Birth:</strong> {user.dateOfBirth ? user.dateOfBirth.substr(0, 10) : ''}</div>
                        <button className="btn btn-gradient w-100 mt-3" onClick={handleEdit}><FaEdit className="me-2" /> Edit Profile</button>
                        <button className="btn btn-gradient w-100 mt-2" onClick={() => setShowPasswordModal(true)}><FaLock className="me-2" /> Change Password</button>
                        <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title className="dark-theme-text">Change Password</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="dark-theme-card-bg dark-theme-text">
                                <form onSubmit={handlePasswordChange}>
                                    <div className="mb-3">
                                        <label className="form-label dark-theme-text">Old Password</label>
                                        <input type="password" className="form-control dark-theme-input" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label dark-theme-text">New Password</label>
                                        <input type="password" className="form-control dark-theme-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
                                    </div>
                                    <button type="submit" className="btn btn-gradient w-100" disabled={changingPassword}>Change Password</button>
                                </form>
                            </Modal.Body>
                        </Modal>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label dark-theme-label">Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <input className="form-control dark-theme-input" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label dark-theme-label">Age</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaBirthdayCake /></span>
                                <input className="form-control dark-theme-input" name="age" value={form.age} onChange={handleChange} inputMode="numeric" pattern="[0-9]*" required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label dark-theme-label">Date of Birth</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaCalendarAlt /></span>
                                <input className="form-control dark-theme-input" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label dark-theme-label">Profile Image</label>
                            <div className="input-group">
                                <span className="input-group-text"><BiImageAdd /></span>
                                <input className="form-control dark-theme-input" name="profileImage" type="file" accept="image/*" onChange={handleChange} />
                            </div>
                        </div>
                        <button className="btn btn-gradient w-100" type="submit">Save</button>
                        <button className="btn btn-secondary w-100 mt-2 dark-theme-secondary-button" type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default withAuth(Profile); 