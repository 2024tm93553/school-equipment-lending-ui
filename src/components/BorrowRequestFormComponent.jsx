import React, { useState, useEffect } from 'react';
import { getAllEquipment } from '../services/EquipmentService';
import { createBorrowRequest } from '../services/BorrowRequestService';
import { useNavigate, useLocation } from 'react-router-dom';

const BorrowRequestFormComponent = () => {
    const [equipment, setEquipment] = useState([]);
    const [form, setForm] = useState({
        equipmentId: '',
        quantity: 1,
        fromDate: '',
        toDate: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchEquipment();

        const urlParams = new URLSearchParams(location.search);
        const equipmentId = urlParams.get('equipmentId');
        if (equipmentId) {
            setForm(prev => ({ ...prev, equipmentId }));
        }
    }, [location]);

    const fetchEquipment = () => {
        getAllEquipment({ availableOnly: true })
            .then(res => {
                // Filter only equipment with available quantity > 0
                const availableEquipment = res.data.filter(item => item.availability && item.availableQuantity > 0);
                setEquipment(availableEquipment);
            })
            .catch(error => {
                console.error('Error fetching equipment:', error);
                alert('Error loading equipment data.');
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const fromDate = new Date(form.fromDate);
        const toDate = new Date(form.toDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (fromDate < today) {
            alert('From date cannot be in the past');
            return;
        }

        if (toDate <= fromDate) {
            alert('To date must be after from date');
            return;
        }

        const selectedEquipment = equipment.find(item => item.equipmentId === parseInt(form.equipmentId));
        if (selectedEquipment && form.quantity > selectedEquipment.availableQuantity) {
            alert(`Only ${selectedEquipment.availableQuantity} items available`);
            return;
        }

        setLoading(true);
        createBorrowRequest({
            equipmentId: parseInt(form.equipmentId),
            quantity: parseInt(form.quantity),
            fromDate: form.fromDate,
            toDate: form.toDate,
            reason: form.reason
        })
        .then(() => {
            alert('Borrow request submitted successfully!');
            navigate('/my-requests');
        })
        .catch(error => {
            console.error('Error creating request:', error);
            const errorMessage = error.response?.data?.message || 'Error submitting request. Please try again.';
            alert(errorMessage);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const selectedEquipment = equipment.find(item => item.equipmentId === parseInt(form.equipmentId));

    return (
        <div className='container'>
            <h2>Create Borrow Request</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Equipment</label>
                    <select
                        className='form-control'
                        name='equipmentId'
                        value={form.equipmentId}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select Equipment</option>
                        {equipment.map(item => (
                            <option key={item.equipmentId} value={item.equipmentId}>
                                {item.name} - {item.category} (Available: {item.availableQuantity})
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Quantity</label>
                    <input
                        type='number'
                        className='form-control'
                        name='quantity'
                        value={form.quantity}
                        min='1'
                        max={selectedEquipment ? selectedEquipment.availableQuantity : 1}
                        onChange={handleChange}
                        required
                    />
                    {selectedEquipment && (
                        <small className='text-muted'>
                            Maximum available: {selectedEquipment.availableQuantity}
                        </small>
                    )}
                </div>

                <div className='mb-3'>
                    <label className='form-label'>From Date</label>
                    <input
                        type='date'
                        className='form-control'
                        name='fromDate'
                        value={form.fromDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>To Date</label>
                    <input
                        type='date'
                        className='form-control'
                        name='toDate'
                        value={form.toDate}
                        min={form.fromDate || new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Reason (Optional)</label>
                    <textarea
                        className='form-control'
                        name='reason'
                        value={form.reason}
                        onChange={handleChange}
                        rows='3'
                        placeholder='Enter reason for borrowing this equipment'
                    />
                </div>

                <button type='submit' className='btn btn-success' disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button type='button' className='btn btn-secondary ms-2' onClick={() => navigate('/equipment')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default BorrowRequestFormComponent;
