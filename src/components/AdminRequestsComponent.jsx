import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getAllRequests, approveRequest, rejectRequest, markAsReturned, REQUEST_STATUS } from '../services/BorrowRequestService';
import AuthService from '../services/AuthService';
import {
    LoadingSpinner,
    StatusBadge,
    Modal,
    FormField,
    Alert,
    DataTable,
    ActionButtons,
    PageHeader,
    DateFormatter
} from './common';
import './EquipmentStyles.css';

// Constants
const MODAL_TYPES = {
    APPROVE: 'approve',
    REJECT: 'reject',
    RETURN: 'return'
};

// Custom Hook for Request Management
const useRequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    const fetchRequests = useCallback(async (filter = null) => {
        setLoading(true);
        try {
            const response = await getAllRequests(filter || null);
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            alert('Error loading requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    const setRequestLoading = useCallback((requestId, isLoading) => {
        setActionLoading(prev => ({ ...prev, [requestId]: isLoading }));
    }, []);

    return {
        requests,
        loading,
        actionLoading,
        fetchRequests,
        setRequestLoading
    };
};

// Custom Hook for Modal Management
const useModalManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ type: '', requestId: '', action: null });
    const [modalForm, setModalForm] = useState({ remarks: '', returnDate: '', conditionAfterUse: '' });

    const openModal = useCallback((type, requestId, action) => {
        setModalData({ type, requestId, action });
        setModalForm({
            remarks: '',
            returnDate: type === MODAL_TYPES.RETURN ? new Date().toISOString().split('T')[0] : '',
            conditionAfterUse: ''
        });
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setModalData({ type: '', requestId: '', action: null });
        setModalForm({ remarks: '', returnDate: '', conditionAfterUse: '' });
    }, []);

    const updateModalForm = useCallback((field, value) => {
        setModalForm(prev => ({ ...prev, [field]: value }));
    }, []);

    return {
        showModal,
        modalData,
        modalForm,
        openModal,
        closeModal,
        updateModalForm
    };
};

// Filter Component
const StatusFilter = ({ value, onChange, options }) => (
    <FormField
        label="Filter by Status"
        name="statusFilter"
        type="select"
        value={value}
        onChange={(name, newValue) => onChange(newValue)}
        options={[{ value: '', label: 'All Requests' }, ...options]}
        className="mb-3"
        inputClassName="w-auto"
    />
);

// Request Action Modal Content
const RequestActionModalContent = ({ type, modalForm, updateModalForm, isLoading }) => {
    const isReturn = type === MODAL_TYPES.RETURN;
    const isReject = type === MODAL_TYPES.REJECT;

    return (
        <>
            {isReturn && (
                <>
                    <FormField
                        label="Return Date"
                        name="returnDate"
                        type="date"
                        value={modalForm.returnDate}
                        onChange={updateModalForm}
                        required
                        max={new Date().toISOString().split('T')[0]}
                        disabled={isLoading}
                    />
                    <FormField
                        label="Condition After Use"
                        name="conditionAfterUse"
                        type="textarea"
                        value={modalForm.conditionAfterUse}
                        onChange={updateModalForm}
                        placeholder="Describe the condition of the equipment after use"
                        disabled={isLoading}
                    />
                </>
            )}
            <FormField
                label={isReject ? 'Reason for Rejection' : 'Remarks'}
                name="remarks"
                type="textarea"
                value={modalForm.remarks}
                onChange={updateModalForm}
                placeholder={isReject ? 'Enter reason for rejection' : 'Enter any remarks'}
                disabled={isLoading}
            />
        </>
    );
};

// Main Component
const AdminRequestsComponent = () => {
    const [filter, setFilter] = useState('');
    const { requests, loading, actionLoading, fetchRequests, setRequestLoading } = useRequestManagement();
    const { showModal, modalData, modalForm, openModal, closeModal, updateModalForm } = useModalManagement();

    // Check admin access
    const isAdmin = useMemo(() => AuthService.isAdmin(), []);
    const userId = useMemo(() => AuthService.getUserId(), []);

    // Filter options
    const filterOptions = useMemo(() => [
        { value: REQUEST_STATUS.PENDING, label: 'Pending' },
        { value: REQUEST_STATUS.APPROVED, label: 'Approved' },
        { value: REQUEST_STATUS.REJECTED, label: 'Rejected' },
        { value: REQUEST_STATUS.RETURNED, label: 'Returned' }
    ], []);

    // Table columns configuration
    const columns = useMemo(() => [
        { key: 'requestId', title: 'ID', width: '80px' },
        { key: 'userName', title: 'User' },
        { key: 'equipmentName', title: 'Equipment' },
        { key: 'quantity', title: 'Qty', width: '80px' },
        {
            key: 'fromDate',
            title: 'From',
            render: (value) => <DateFormatter date={value} />
        },
        {
            key: 'toDate',
            title: 'To',
            render: (value) => <DateFormatter date={value} />
        },
        {
            key: 'status',
            title: 'Status',
            render: (value) => <StatusBadge status={value} />
        },
        { key: 'reason', title: 'Reason' },
        { key: 'remarks', title: 'Remarks' },
        {
            key: 'actions',
            title: 'Actions',
            render: (_, request) => {
                const actions = [];

                if (request.status === REQUEST_STATUS.PENDING) {
                    actions.push(
                        {
                            label: 'Approve',
                            variant: 'success',
                            onClick: () => handleApprove(request.requestId),
                            disabled: () => actionLoading[request.requestId]
                        },
                        {
                            label: 'Reject',
                            variant: 'danger',
                            onClick: () => handleReject(request.requestId),
                            disabled: () => actionLoading[request.requestId]
                        }
                    );
                } else if (request.status === REQUEST_STATUS.APPROVED) {
                    actions.push({
                        label: 'Mark Returned',
                        variant: 'info',
                        onClick: () => handleReturn(request.requestId),
                        disabled: () => actionLoading[request.requestId]
                    });
                }

                return actions.length > 0 ? (
                    <ActionButtons actions={actions} item={request} />
                ) : (
                    <span className='text-muted'>No actions</span>
                );
            }
        }
    ], [actionLoading]);

    // Fetch requests when filter changes
    useEffect(() => {
        if (isAdmin) {
            fetchRequests(filter);
        }
    }, [filter, isAdmin, fetchRequests]);

    // Action handlers
    const handleApprove = useCallback((requestId) => {
        const performApproval = async () => {
            setRequestLoading(requestId, true);
            try {
                await approveRequest(requestId, {
                    approvedBy: userId,
                    remarks: modalForm.remarks
                });
                alert('Request approved successfully!');
                await fetchRequests(filter);
                closeModal();
            } catch (error) {
                console.error('Error approving request:', error);
                alert('Error approving request. Please try again.');
            } finally {
                setRequestLoading(requestId, false);
            }
        };

        openModal(MODAL_TYPES.APPROVE, requestId, performApproval);
    }, [userId, modalForm.remarks, filter, setRequestLoading, fetchRequests, closeModal, openModal]);

    const handleReject = useCallback((requestId) => {
        const performRejection = async () => {
            setRequestLoading(requestId, true);
            try {
                await rejectRequest(requestId, {
                    remarks: modalForm.remarks
                });
                alert('Request rejected successfully!');
                await fetchRequests(filter);
                closeModal();
            } catch (error) {
                console.error('Error rejecting request:', error);
                alert('Error rejecting request. Please try again.');
            } finally {
                setRequestLoading(requestId, false);
            }
        };

        openModal(MODAL_TYPES.REJECT, requestId, performRejection);
    }, [modalForm.remarks, filter, setRequestLoading, fetchRequests, closeModal, openModal]);

    const handleReturn = useCallback((requestId) => {
        const performReturn = async () => {
            if (!modalForm.returnDate) {
                alert('Return date is required');
                return;
            }

            setRequestLoading(requestId, true);
            try {
                await markAsReturned(requestId, {
                    returnDate: modalForm.returnDate,
                    conditionAfterUse: modalForm.conditionAfterUse
                });
                alert('Item marked as returned successfully!');
                await fetchRequests(filter);
                closeModal();
            } catch (error) {
                console.error('Error marking as returned:', error);
                alert('Error marking as returned. Please try again.');
            } finally {
                setRequestLoading(requestId, false);
            }
        };

        openModal(MODAL_TYPES.RETURN, requestId, performReturn);
    }, [modalForm.returnDate, modalForm.conditionAfterUse, filter, setRequestLoading, fetchRequests, closeModal, openModal]);

    const handleModalSubmit = useCallback(() => {
        if (modalData.action) {
            modalData.action();
        }
    }, [modalData.action]);

    // Modal configuration
    const modalConfig = {
        [MODAL_TYPES.APPROVE]: {
            title: 'Approve Request',
            submitText: 'Approve',
            submitVariant: 'success'
        },
        [MODAL_TYPES.REJECT]: {
            title: 'Reject Request',
            submitText: 'Reject',
            submitVariant: 'danger'
        },
        [MODAL_TYPES.RETURN]: {
            title: 'Mark as Returned',
            submitText: 'Mark Returned',
            submitVariant: 'info'
        }
    };

    // Access control
    if (!isAdmin) {
        return (
            <div className='container'>
                <Alert
                    variant="danger"
                    title="Access Denied"
                    message="This page is only available to administrators and staff."
                />
            </div>
        );
    }

    return (
        <div className='container'>
            <div className="equipment-dashboard">
                <PageHeader
                    title="Manage Borrow Requests"
                    subtitle={`${requests.length} request${requests.length !== 1 ? 's' : ''}`}
                    description="Review and manage equipment borrow requests from students and staff."
                />
            </div>

            <div className="search-filter-section">
                <StatusFilter
                    value={filter}
                    onChange={setFilter}
                    options={filterOptions}
                />
            </div>

            <DataTable
                data={requests}
                columns={columns}
                loading={loading}
                emptyMessage="No requests found for the selected filter."
            />

            <Modal
                show={showModal}
                title={modalConfig[modalData.type]?.title}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                submitText={modalConfig[modalData.type]?.submitText}
                submitVariant={modalConfig[modalData.type]?.submitVariant}
                isLoading={actionLoading[modalData.requestId]}
            >
                <RequestActionModalContent
                    type={modalData.type}
                    modalForm={modalForm}
                    updateModalForm={updateModalForm}
                    isLoading={actionLoading[modalData.requestId]}
                />
            </Modal>
        </div>
    );
};

export default AdminRequestsComponent;
