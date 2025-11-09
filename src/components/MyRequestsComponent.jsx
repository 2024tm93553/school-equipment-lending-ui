import React, { useEffect, useState } from 'react';
import { getMyRequests } from '../services/BorrowRequestService';
import { useNavigate } from 'react-router-dom';

const MyRequestsComponent = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = () => {
        setLoading(true);
        getMyRequests()
            .then(res => {
                setRequests(res.data);
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
                alert('Error loading your requests.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'PENDING': 'badge bg-warning text-dark',
            'APPROVED': 'badge bg-success',
            'REJECTED': 'badge bg-danger',
            'RETURNED': 'badge bg-secondary'
        };
        return <span className={statusClasses[status] || 'badge bg-light'}>{status}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <div className='container'><h2>Loading your requests...</h2></div>;
    }

    return (
        <div className='container'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h2>My Borrow Requests</h2>
                <button className='btn btn-primary' onClick={() => navigate('/borrow-request')}>
                    New Request
                </button>
            </div>

            {requests.length === 0 ? (
                <div className='alert alert-info'>
                    No requests found. <button className='btn btn-link p-0' onClick={() => navigate('/borrow-request')}>Create your first request</button>
                </div>
            ) : (
                <div className='table-responsive'>
                    <table className='table table-bordered table-striped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>Request ID</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Reason</th>
                                <th>Remarks</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request.requestId}>
                                    <td>{request.requestId}</td>
                                    <td>{request.equipmentName}</td>
                                    <td>{request.quantity}</td>
                                    <td>{formatDate(request.fromDate)}</td>
                                    <td>{formatDate(request.toDate)}</td>
                                    <td>{formatDate(request.returnDate)}</td>
                                    <td>{getStatusBadge(request.status)}</td>
                                    <td>{request.reason || '-'}</td>
                                    <td>{request.remarks || '-'}</td>
                                    <td>{formatDate(request.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyRequestsComponent;
