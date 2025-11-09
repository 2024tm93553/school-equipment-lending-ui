import React, { useState } from 'react';
import { registerAPICall } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

// Constants
const INITIAL_FORM_STATE = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'STUDENT'
};

const ROLES = [
    { value: 'STUDENT', label: 'STUDENT' }
];

const RegisterComponent = () => {
    // State management
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerAPICall(formData);
            console.log('Registration successful:', response.data);
            alert('Registration successful! Please login with your credentials.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Render form field with error handling
    const renderFormField = (name, label, type = 'text', options = null) => (
        <div className='mb-3'>
            <label htmlFor={name} className='form-label'>
                {label} <span className='text-danger'>*</span>
            </label>
            {options ? (
                <select
                    id={name}
                    name={name}
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={isLoading}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    autoComplete={
                        name === 'password' ? 'new-password' :
                        name === 'email' ? 'email' :
                        name === 'username' ? 'username' : 'off'
                    }
                />
            )}
            {errors[name] && (
                <div className='invalid-feedback d-block'>
                    {errors[name]}
                </div>
            )}
        </div>
    );

    return (
        <div className='container animate-fade-in-up'>
            <div className='row justify-content-center mt-5'>
                <div className='col-md-6'>
                    <div className='card shadow-lg hover-lift'>
                        <div className='card-header bg-primary text-white'>
                            <h2 className='text-center mb-0'>User Registration</h2>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit} noValidate className="request-form">
                                {renderFormField('fullName', 'Full Name')}
                                {renderFormField('username', 'Username')}
                                {renderFormField('email', 'Email', 'email')}
                                {renderFormField('password', 'Password', 'password')}
                                {renderFormField('role', 'Role', 'select', ROLES)}

                                <div className='d-grid gap-2'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary btn-lg btn-ripple'
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2 animate-spin' role='status' aria-hidden='true'></span>
                                                Registering...
                                            </>
                                        ) : (
                                            'Register'
                                        )}
                                    </button>
                                </div>

                                <div className='text-center mt-3'>
                                    <span className='text-muted'>Already have an account? </span>
                                    <button
                                        type='button'
                                        className='btn btn-link p-0 hover-glow'
                                        onClick={() => navigate('/login')}
                                        disabled={isLoading}
                                    >
                                        Sign in here
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
