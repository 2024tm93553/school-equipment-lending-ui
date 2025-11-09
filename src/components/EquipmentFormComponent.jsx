import React, { useState, useEffect } from 'react';
import { addEquipment, getEquipmentById, updateEquipment } from '../services/EquipmentService';
import { useNavigate, useParams } from 'react-router-dom';

const EquipmentFormComponent = () => {
    const [form, setForm] = useState({
        name: '',
        category: '',
        condition: '',
        totalQuantity: 1,
        availableQuantity: 1,
        availability: true,
        description: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    useEffect(() => {
        if(isEdit){
            getEquipmentById(id).then(res => setForm(res.data));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = isEdit ? updateEquipment(id, form) : addEquipment(form);
        action.then(() => {
            alert(isEdit ? 'Equipment updated successfully!' : 'Equipment added successfully!');
            navigate('/equipment');
        }).catch(error => {
            console.error('Error saving equipment:', error);
            alert('Error saving equipment. Please try again.');
        });
    };

    return (
        <div className='container'>
            <h2>{isEdit ? 'Edit' : 'Add'} Equipment</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Name</label>
                    <input type='text' className='form-control' name='name' value={form.name} onChange={handleChange} required />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Category</label>
                    <input type='text' className='form-control' name='category' value={form.category} onChange={handleChange} required />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Condition</label>
                    <input type='text' className='form-control' name='condition' value={form.condition} onChange={handleChange} required />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea
                        className='form-control'
                        name='description'
                        value={form.description}
                        onChange={handleChange}
                        rows='3'
                        placeholder='Enter equipment description (optional)'
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Total Quantity</label>
                    <input type='number' className='form-control' name='totalQuantity' value={form.totalQuantity} min='1' onChange={handleChange} required />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Available Quantity</label>
                    <input type='number' className='form-control' name='availableQuantity' value={form.availableQuantity} min='1' onChange={handleChange} required />
                </div>
                <div className='form-check mb-3'>
                    <input className='form-check-input' type='checkbox' name='availability' checked={form.availability} onChange={handleChange} id='availabilityCheck' />
                    <label className='form-check-label' htmlFor='availabilityCheck'>Available</label>
                </div>
                <button type='submit' className='btn btn-success'>{isEdit ? 'Update' : 'Add'}</button>
                <button type='button' className='btn btn-secondary ms-2' onClick={() => navigate('/equipment')}>Cancel</button>
            </form>
        </div>
    );
};

export default EquipmentFormComponent;
