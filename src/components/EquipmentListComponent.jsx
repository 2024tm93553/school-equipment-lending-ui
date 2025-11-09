import React, { useEffect, useState } from 'react';
import { getAllEquipment, deleteEquipment } from '../services/EquipmentService';
import { useNavigate } from 'react-router-dom';

const EquipmentListComponent = () => {
    const [equipment, setEquipment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        availableOnly: false,
        search: ''
    });
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const isAdmin = role === 'TEACHER' || role === 'ADMIN'; // Allow TEACHER and ADMIN roles
    const isStudent = role === 'STUDENT';

    useEffect(() => {
        fetchEquipment();
    }, [filters]);

    const fetchEquipment = () => {
        const filterParams = {};
        if (filters.category) filterParams.category = filters.category;
        if (filters.availableOnly) filterParams.availableOnly = filters.availableOnly;
        if (filters.search.trim()) filterParams.search = filters.search.trim();

        getAllEquipment(filterParams).then(res => {
            setEquipment(res.data);
            const uniqueCategories = [...new Set(res.data.map(item => item.category))];
            setCategories(uniqueCategories);
        }).catch(error => {
            console.error('Error fetching equipment:', error);
            alert('Error loading equipment data. Please refresh the page.');
        });
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            availableOnly: false,
            search: ''
        });
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this item?')){
            deleteEquipment(id).then(() => {
                alert('Equipment deleted successfully!');
                fetchEquipment();
            }).catch(error => {
                console.error('Error deleting equipment:', error);
                alert('Error deleting equipment. Please try again.');
            });
        }
    };

    const handleRequestEquipment = (equipmentId) => {
        navigate(`/borrow-request?equipmentId=${equipmentId}`);
    };

    return (
        <div className='container'>
            <h2 className='text-center'>Equipment Dashboard</h2>

            <div className='card mb-4'>
                <div className='card-header'>
                    <h5>Search & Filters</h5>
                </div>
                <div className='card-body'>
                    <div className='row g-3'>
                        <div className='col-md-4'>
                            <label className='form-label'>Search Equipment</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search by name or description...'
                                value={filters.search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className='col-md-3'>
                            <label className='form-label'>Category</label>
                            <select
                                className='form-control'
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value=''>All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className='col-md-3'>
                            <label className='form-label'>Availability</label>
                            <div className='form-check mt-2'>
                                <input
                                    className='form-check-input'
                                    type='checkbox'
                                    checked={filters.availableOnly}
                                    onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                                    id='availableOnlyCheck'
                                />
                                <label className='form-check-label' htmlFor='availableOnlyCheck'>
                                    Available Only
                                </label>
                            </div>
                        </div>
                        <div className='col-md-2'>
                            <label className='form-label'>&nbsp;</label>
                            <div>
                                <button className='btn btn-secondary btn-sm' onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='d-flex justify-content-between align-items-center mb-3'>
                <div>
                    <span className='text-muted'>
                        Showing {equipment.length} equipment{equipment.length !== 1 ? 's' : ''}
                    </span>
                </div>
                {isAdmin && (
                    <button className='btn btn-primary' onClick={() => navigate('/add-equipment')}>
                        Add Equipment
                    </button>
                )}
            </div>

            {equipment.length === 0 ? (
                <div className='alert alert-info'>
                    No equipment found matching your search criteria.
                </div>
            ) : (
                <div className='table-responsive'>
                    <table className='table table-bordered table-striped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Condition</th>
                                <th>Total Quantity</th>
                                <th>Available Quantity</th>
                                <th>Description</th>
                                <th>Status</th>
                                {(isAdmin || isStudent) && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map(item => (
                                <tr key={item.equipmentId}>
                                    <td><strong>{item.name}</strong></td>
                                    <td>
                                        <span className='badge bg-secondary'>{item.category}</span>
                                    </td>
                                    <td>{item.conditionStatus}</td>
                                    <td>{item.totalQuantity}</td>
                                    <td>
                                        <span className={`badge ${item.availableQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                                            {item.availableQuantity}
                                        </span>
                                    </td>
                                    <td>
                                        {item.description ? (
                                            <span title={item.description}>
                                                {item.description.length > 50
                                                    ? `${item.description.substring(0, 50)}...`
                                                    : item.description}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <span className={`badge ${item.availability ? 'bg-success' : 'bg-danger'}`}>
                                            {item.availability ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    {(isAdmin || isStudent) && (
                                        <td>
                                            {isAdmin && (
                                                <>
                                                    <button
                                                        className='btn btn-info btn-sm me-1'
                                                        onClick={() => navigate(`/edit-equipment/${item.equipmentId}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className='btn btn-danger btn-sm'
                                                        onClick={() => handleDelete(item.equipmentId)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                            {isStudent && item.availability && item.availableQuantity > 0 && (
                                                <button
                                                    className='btn btn-success btn-sm'
                                                    onClick={() => handleRequestEquipment(item.equipmentId)}
                                                >
                                                    Request
                                                </button>
                                            )}
                                            {isStudent && (!item.availability || item.availableQuantity === 0) && (
                                                <span className='text-muted small'>Not Available</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EquipmentListComponent;

