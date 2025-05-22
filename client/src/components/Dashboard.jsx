import React, { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../auth/withAuth';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const taskSchema = yup.object().shape({
    title: yup.string().required('Task Name is required'),
    description: yup.string().required('Task Description is required'),
    status: yup.string().oneOf(['Pending', 'Completed']).required('Status is required'),
});

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(taskSchema),
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userid');
            if (!token || !userId) {
                Swal.fire({ icon: 'error', title: 'Authentication Error', text: 'User not authenticated' });
                return;
            }

            const res = await axios.get(`http://localhost:5000/getlistbyuserid/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(Array.isArray(res.data.lists) ? res.data.lists : []);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error fetching tasks', text: error.response?.data?.message || 'Failed to retrieve tasks' });
        }
    };


    const createTask = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/addlist', data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({ icon: 'success', title: 'Task added successfully', timer: 1200 });
            reset();
            fetchTasks();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error adding task', text: error.response?.data?.message || error.message });
        }
    };

    // Delete Task
    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/deletelist/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({ icon: 'success', title: 'Task deleted successfully', timer: 1200 });
            fetchTasks();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error deleting task', text: error.message });
        }
    };

    // Update Task
    const updateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/updatelist/${selectedTask._id}`, selectedTask, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({ icon: 'success', title: 'Task updated successfully', timer: 1200 });
            setSelectedTask(null);
            fetchTasks();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error updating task', text: error.message });
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4 w-100" style={{ maxWidth: 1000, height: '90vh' }}>
                <h2 className="mb-4 text-primary text-center">My To-Do List</h2>

                {/* Form */}
                <form onSubmit={handleSubmit(createTask)} className="mb-4">
                    {/* <h3>Add New Task</h3> */}
                    <input className="form-control mb-2" {...register("title")} placeholder="Task Name" />
                    {errors.title && <span className="text-danger">{errors.title.message}</span>}

                    <input className="form-control mb-2" {...register("description")} placeholder="Task Description" />
                    {errors.description && <span className="text-danger">{errors.description.message}</span>}

                    <select className="form-control mb-2" {...register("status")}>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                    {errors.status && <span className="text-danger">{errors.status.message}</span>}

                    <button type="submit" className="btn btn-primary w-100">Add Task</button>
                </form>

                {/* Task List */}

                {/* Search and Filter Controls */}
                <div className="row mb-3">
                    <div className="col-md-8 mb-2 mb-md-0">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by task name or description..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-control"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                <ul className="list-group">
                    {filteredTasks.length === 0 && (
                        <li className="list-group-item text-muted text-center">No tasks found!</li>
                    )}
                    {filteredTasks.map((task) => (
                        <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{task.title} - {task.description}</span>
                            <div>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => setSelectedTask(task)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Edit Task Modal */}
            {selectedTask && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Task</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedTask(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={updateTask}>
                                    <input className="form-control mb-2" value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} placeholder="Task Name" required />
                                    <input className="form-control mb-2" value={selectedTask.description} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} placeholder="Task Description" required />
                                    <select className="form-control mb-2" value={selectedTask.status} onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })} required>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button type="submit" className="btn btn-primary w-100">Update Task</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(Dashboard);