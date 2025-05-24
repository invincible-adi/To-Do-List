import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import withAuth from '../auth/withAuth';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ClipLoader } from 'react-spinners';

const taskSchema = yup.object().shape({
    title: yup.string()
        .required('Task Name is required')
        .min(3, 'Task name must be at least 3 characters')
        .max(100, 'Task name cannot exceed 100 characters'),
    description: yup.string()
        .required('Task Description is required')
        .min(5, 'Task description must be at least 5 characters')
        .max(500, 'Task description cannot exceed 500 characters'),
    status: yup.string().oneOf(['Pending', 'Completed']).required('Status is required'),
});

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(taskSchema),
    });

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line
    }, [searchTerm, filterStatus, page]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {
                searchTerm,
                status: filterStatus,
                page,
                limit
            };
            const res = await axiosInstance.get('/todos', { params });
            setTimeout(() => {
                setTasks(res.data.lists);
                setTotalPages(res.data.totalPages);
                setLimit(res.data.limit || 5);
                setTotal(res.data.total || 0);
                setLoading(false);
            }, 1000);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error fetching tasks', text: error.response?.data?.message || 'Failed to retrieve tasks' });
            setLoading(false);
        }
    };

    const createTask = async (data) => {
        try {
            await axiosInstance.post('/addlist', data);

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
            await axiosInstance.delete(`/deletelist/${id}`);

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
            await axiosInstance.put(`/updatelist/${selectedTask._id}`, selectedTask);

            Swal.fire({ icon: 'success', title: 'Task updated successfully', timer: 1200 });
            setSelectedTask(null);
            fetchTasks();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error updating task', text: error.message });
        }
    };

    // Add a handler for search button
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setPage(1);
    };

    // Add a reset handler
    const handleResetFilters = () => {
        setSearchInput("");
        setSearchTerm("");
        setFilterStatus("All");
        setPage(1);
    };

    return (
        <div className="container py-4">
            <div className="card shadow-lg p-4 mx-auto card-gradient" style={{ maxWidth: 1200 }}>
                <h2 className="mb-4 text-primary text-center">My To-Do List</h2>

                {/* Form */}
                <form onSubmit={handleSubmit(createTask)} className="mb-4 blur-background p-3 rounded">
                    <h3 className="h5 mb-3 text-white">Add New Task</h3>
                    <div className="row g-3">
                        <div className="col-md-5">
                            <input className={`form-control ${errors.title ? 'is-invalid' : ''} dark-theme-input`} {...register("title")} placeholder="Task Name" />
                            {errors.title && <span className="text-danger d-block">{errors.title.message}</span>}
                        </div>
                        <div className="col-md-5">
                            <input className={`form-control ${errors.description ? 'is-invalid' : ''} dark-theme-input`} {...register("description")} placeholder="Task Description" />
                            {errors.description && <span className="text-danger d-block">{errors.description.message}</span>}
                        </div>
                        <div className="col-md-2">
                            <select className={`form-select ${errors.status ? 'is-invalid' : ''} dark-theme-input`} {...register("status")}>
                                <option value="" disabled>Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {errors.status && <span className="text-danger d-block">{errors.status.message}</span>}
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-gradient w-100">Add Task</button>
                        </div>
                    </div>
                </form>

                {/* Search and Filter Controls */}
                <div className="row mb-3 g-3 align-items-center">
                    <div className="col-md-6">
                        <form className="d-flex gap-2" onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="form-control dark-theme-input"
                                placeholder="Search by task name or description..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                            <button className="btn btn-gradient" type="submit">Search</button>
                            <button className="btn btn-secondary dark-theme-secondary-button" type="button" onClick={handleResetFilters}>Reset</button>
                        </form>
                    </div>
                    <div className="col-md-3 ms-auto">
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Total count and Pagination Controls in one row */}
                <div className="row mb-3 d-flex justify-content-between align-items-center">
                    {/* Total count */}
                    <div className="col-auto">
                        <span className=" text-white">
                            {tasks.length > 0 ? `${(page - 1) * limit + 1}-${(page - 1) * limit + tasks.length} of ${total}` : `0 of ${total}`}
                        </span>
                    </div>
                    {/* Pagination Controls */}
                    <div className="col-auto d-flex align-items-center gap-2">
                        <button className="btn btn-secondary dark-theme-secondary-button" onClick={() => setPage(page - 1)} disabled={page <= 1}>Prev</button>
                        <span className="mx-2 text-white">Page {page} of {totalPages}</span>
                        <button className="btn btn-secondary dark-theme-secondary-button" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
                    </div>
                </div>
                <ul className="list-group">
                    {loading ? (
                        <li className="list-group-item text-center dark-theme-text blur-background rounded">
                            <ClipLoader color="var(--dark-primary)" loading={loading} size={35} />
                        </li>
                    ) : tasks.length === 0 ? (
                        <li className="list-group-item text-muted text-center blur-background rounded">No tasks found!</li>
                    ) : tasks.map((task) => (
                        <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center mb-2 blur-background rounded">
                            <span className="dark-theme-text">{task.title} - {task.description}</span>
                            <div>
                                <button className="btn btn-warning btn-sm me-2 dark-theme-warning-button" onClick={() => setSelectedTask(task)}>Edit</button>
                                <button className="btn btn-danger btn-sm dark-theme-danger-button" onClick={() => deleteTask(task._id)}>Delete</button>
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
                                <h5 className="modal-title dark-theme-text">Edit Task</h5>
                                <button type="button" className="btn-close dark-theme-close-button" onClick={() => setSelectedTask(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={updateTask}>
                                    <input className="form-control mb-2 dark-theme-input" value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} placeholder="Task Name" required />
                                    <input className="form-control mb-2 dark-theme-input" value={selectedTask.description} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} placeholder="Task Description" required />
                                    <select className="form-control mb-2 dark-theme-input" value={selectedTask.status} onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })} required>
                                        <option value="" disabled>Select status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button type="submit" className="btn btn-gradient w-100">Update Task</button>
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