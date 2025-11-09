import React, { useEffect, useState } from 'react';
import { getAllRequests, approveRequest, rejectRequest, markAsReturned } from '../services/BorrowRequestService';

const AdminRequestsComponent = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [actionLoading, setActionLoading] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ type: '', requestId: '', action: null });
    const [modalForm, setModalForm] = useState({ remarks: '', returnDate: '', conditionAfterUse: '' });

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const isAdmin = role === 'TEACHER' || role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            fetchRequests();
        }
    }, [filter, isAdmin]);

    const fetchRequests = () => {
        setLoading(true);
        getAllRequests(filter || null)
            .then(res => {
                setRequests(res.data);
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
                alert('Error loading requests.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleApprove = (requestId) => {
        setModalData({
            type: 'approve',
            requestId,
            action: () => performApproval(requestId)
        });
        setModalForm({ remarks: '', returnDate: '', conditionAfterUse: '' });
        setShowModal(true);
    };

    const handleReject = (requestId) => {
        setModalData({
            type: 'reject',
            requestId,
            action: () => performRejection(requestId)
        });
        setModalForm({ remarks: '', returnDate: '', conditionAfterUse: '' });
        setShowModal(true);
    };

    const handleReturn = (requestId) => {
        setModalData({
            type: 'return',
            requestId,
            action: () => performReturn(requestId)
        });
        setModalForm({
            remarks: '',
            returnDate: new Date().toISOString().split('T')[0],
            conditionAfterUse: ''
        });
        setShowModal(true);
    };

    const performApproval = (requestId) => {
        setActionLoading(prev => ({ ...prev, [requestId]: true }));
        approveRequest(requestId, {
            approvedBy: parseInt(userId),
            remarks: modalForm.remarks
        })
        .then(() => {
            alert('Request approved successfully!');
            fetchRequests();
            setShowModal(false);
        })
        .catch(error => {
            console.error('Error approving request:', error);
            alert('Error approving request. Please try again.');
        })
        .finally(() => {
            setActionLoading(prev => ({ ...prev, [requestId]: false }));
        });
    };

    const performRejection = (requestId) => {
        setActionLoading(prev => ({ ...prev, [requestId]: true }));
        rejectRequest(requestId, {
            remarks: modalForm.remarks
        })
        .then(() => {
            alert('Request rejected successfully!');
            fetchRequests();
            setShowModal(false);
        })
        .catch(error => {
            console.error('Error rejecting request:', error);
            alert('Error rejecting request. Please try again.');
        })
        .finally(() => {
            setActionLoading(prev => ({ ...prev, [requestId]: false }));
        });
    };

    const performReturn = (requestId) => {
        if (!modalForm.returnDate) {
            alert('Return date is required');
            return;
        }

        setActionLoading(prev => ({ ...prev, [requestId]: true }));
        markAsReturned(requestId, {
            returnDate: modalForm.returnDate,
            conditionAfterUse: modalForm.conditionAfterUse
        })
        .then(() => {
            alert('Item marked as returned successfully!');
            fetchRequests();
            setShowModal(false);
        })
        .catch(error => {
            console.error('Error marking as returned:', error);
            alert('Error marking as returned. Please try again.');
        })
        .finally(() => {
            setActionLoading(prev => ({ ...prev, [requestId]: false }));
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

    const handleModalSubmit = () => {
        if (modalData.action) {
            modalData.action();
        }
    };

    const handleModalFormChange = (e) => {
        const { name, value } = e.target;
        setModalForm(prev => ({ ...prev, [name]: value }));
    };

    if (!isAdmin) {
        return (
            <div className='container'>
                <div className='alert alert-danger'>
                    Access denied. This page is only available to administrators and staff.
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className='container'><h2>Loading requests...</h2></div>;
    }

    return (
        <div className='container'>
            <h2>Manage Borrow Requests</h2>

            <div className='mb-3'>
                <label className='form-label'>Filter by Status:</label>
                <select
                    className='form-control'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value=''>All Requests</option>
                    <option value='PENDING'>Pending</option>
                    <option value='APPROVED'>Approved</option>
                    <option value='REJECTED'>Rejected</option>
                    <option value='RETURNED'>Returned</option>
                </select>
            </div>

            {requests.length === 0 ? (
                <div className='alert alert-info'>
                    No requests found for the selected filter.
                </div>
            ) : (
                <div className='table-responsive'>
                    <table className='table table-bordered table-striped'>
                        <thead className='table-dark'>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Equipment</th>
                                <th>Qty</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Status</th>
                                <th>Reason</th>
                                <th>Remarks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request.requestId}>
                                    <td>{request.requestId}</td>
                                    <td>{request.userName}</td>
                                    <td>{request.equipmentName}</td>
                                    <td>{request.quantity}</td>
                                    <td>{formatDate(request.fromDate)}</td>
                                    <td>{formatDate(request.toDate)}</td>
                                    <td>{getStatusBadge(request.status)}</td>
                                    <td>{request.reason || '-'}</td>
                                    <td>{request.remarks || '-'}</td>
                                    <td>
                                        {request.status === 'PENDING' && (
                                            <div>
                                                <button
                                                    className='btn btn-success btn-sm me-1'
                                                    onClick={() => handleApprove(request.requestId)}
                                                    disabled={actionLoading[request.requestId]}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className='btn btn-danger btn-sm'
                                                    onClick={() => handleReject(request.requestId)}
                                                    disabled={actionLoading[request.requestId]}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {request.status === 'APPROVED' && (
                                            <button
                                                className='btn btn-info btn-sm'
                                                onClick={() => handleReturn(request.requestId)}
                                                disabled={actionLoading[request.requestId]}
                                            >
                                                Mark Returned
                                            </button>
                                        )}
                                        {(request.status === 'REJECTED' || request.status === 'RETURNED') && (
                                            <span className='text-muted'>No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for actions */}
            {showModal && (
                <div className='modal show d-block' style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>
                                    {modalData.type === 'approve' && 'Approve Request'}
                                    {modalData.type === 'reject' && 'Reject Request'}
                                    {modalData.type === 'return' && 'Mark as Returned'}
                                </h5>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className='modal-body'>
                                {modalData.type === 'return' && (
                                    <div className='mb-3'>
                                        <label className='form-label'>Return Date *</label>
                                        <input
                                            type='date'
                                            className='form-control'
                                            name='returnDate'
                                            value={modalForm.returnDate}
                                            onChange={handleModalFormChange}
                                            max={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                )}

                                {modalData.type === 'return' && (
                                    <div className='mb-3'>
                                        <label className='form-label'>Condition After Use</label>
                                        <textarea
                                            className='form-control'
                                            name='conditionAfterUse'
                                            value={modalForm.conditionAfterUse}
                                            onChange={handleModalFormChange}
                                            rows='3'
                                            placeholder='Describe the condition of the equipment after use'
                                        />
                                    </div>
                                )}

                                <div className='mb-3'>
                                    <label className='form-label'>
                                        {modalData.type === 'reject' ? 'Reason for Rejection' : 'Remarks'}
                                    </label>
                                    <textarea
                                        className='form-control'
                                        name='remarks'
                                        value={modalForm.remarks}
                                        onChange={handleModalFormChange}
                                        rows='3'
                                        placeholder={modalData.type === 'reject' ? 'Enter reason for rejection' : 'Enter any remarks'}
                                    />
                                </div>
                            </div>
                            <div className='modal-footer'>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    className={`btn ${modalData.type === 'approve' ? 'btn-success' : modalData.type === 'reject' ? 'btn-danger' : 'btn-info'}`}
                                    onClick={handleModalSubmit}
                                    disabled={actionLoading[modalData.requestId]}
                                >
                                    {actionLoading[modalData.requestId] ? 'Processing...' :
                                     modalData.type === 'approve' ? 'Approve' :
                                     modalData.type === 'reject' ? 'Reject' : 'Mark Returned'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRequestsComponent;
