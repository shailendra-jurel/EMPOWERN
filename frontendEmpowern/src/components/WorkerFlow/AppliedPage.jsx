import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Typography, Button, Spin, message, Modal, Tooltip, Empty, Dropdown, Menu,Tag,Avatar } from 'antd';
import { 
PlusOutlined, 
ReloadOutlined, 
FilterOutlined, 
EllipsisOutlined,
ClockCircleOutlined,
CheckCircleOutlined,
InfoCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

// API Calls (ensure these are imported from your actual API file)
import { 
getJobAssignmentsByWorkerId, 
getJobAssignmentById,
withdrawJobApplication
} from '../../calls/JobAssignmentCalls';

const { Title, Text, Paragraph } = Typography;

const AppliedPage = () => {
// Navigation hook
const navigate = useNavigate();

// Redux state for worker ID
const { workerId } = useSelector((state) => state.app.workerId);

// State management
const [jobData, setJobData] = useState({
recent: [],     // Recently applied jobs
pending: [],    // Jobs pending review
opportunities: [] // Potential future opportunities
});

// Loading and error states
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

// Detailed job modal state
const [selectedJob, setSelectedJob] = useState(null);
const [isJobModalVisible, setIsJobModalVisible] = useState(false);

// Filtering and sorting
const [filterOptions, setFilterOptions] = useState({
sortBy: 'date',
orderBy: 'desc',
status: 'all'
});

// Refs for component lifecycle management
const isMounted = useRef(true);
const previousWorkerId = useRef(workerId);

// Fetch job assignments with enhanced categorization
const fetchJobAssignments = useCallback(async () => {
if (!workerId) return;

setIsLoading(true);
setError(null);

try {
    const jobAssignments = await getJobAssignmentsByWorkerId(workerId);

    if (!isMounted.current) return;

    // Advanced job categorization
    const categorizedJobs = jobAssignments.reduce((acc, assignment) => {
    const timeSinceApplication = (new Date() - new Date(assignment.createdAt)) / (1000 * 60 * 60 * 24);

    if (timeSinceApplication <= 7) {
        acc.recent.push(assignment);
    }

    if (assignment.status === 'Pending Review') {
        acc.pending.push(assignment);
    }

    // Add logic for potential opportunities
    if (assignment.status === 'Open' && timeSinceApplication > 7) {
        acc.opportunities.push(assignment);
    }

    return acc;
    }, { recent: [], pending: [], opportunities: [] });

    // Sorting function
    const sortJobs = (jobs) => jobs
    .sort((a, b) => {
        switch (filterOptions.sortBy) {
        case 'payRate':
            return filterOptions.orderBy === 'asc' 
            ? a.job.payRate - b.job.payRate
            : b.job.payRate - a.job.payRate;
        default:
            return filterOptions.orderBy === 'asc' 
            ? new Date(a.job.createdAt) - new Date(b.job.createdAt)
            : new Date(b.job.createdAt) - new Date(a.job.createdAt);
        }
    })
    .slice(0, 5);

    setJobData({
    recent: sortJobs(categorizedJobs.recent),
    pending: sortJobs(categorizedJobs.pending),
    opportunities: sortJobs(categorizedJobs.opportunities)
    });

} catch (error) {
    if (isMounted.current) {
    const errorMessage = error.response?.data?.message || 'Network error occurred';
    setError(errorMessage);
    message.error(errorMessage, 3);
    }
} finally {
    if (isMounted.current) {
    setIsLoading(false);
    }
}
}, [workerId, filterOptions]);

// Debounced refresh to prevent excessive API calls
const debouncedRefresh = useCallback(
debounce(() => fetchJobAssignments(), 300),
[fetchJobAssignments]
);

// Fetch detailed job information
const fetchJobDetails = async (jobId) => {
try {
    const jobDetails = await getJobAssignmentById(jobId);
    setSelectedJob(jobDetails);
    setIsJobModalVisible(true);
} catch (error) {
    message.error('Failed to fetch job details', 3);
}
};

// Job action handlers
const handleWithdrawApplication = async (jobId) => {
try {
    await withdrawJobApplication(jobId);
    message.success('Application withdrawn successfully');
    debouncedRefresh();
} catch (error) {
    message.error('Failed to withdraw application', 3);
}
};

// Lifecycle effects
useEffect(() => {
if (workerId !== previousWorkerId.current) {
    fetchJobAssignments();
    previousWorkerId.current = workerId;
}

return () => {
    isMounted.current = false;
};
}, [workerId, fetchJobAssignments]);

// Render individual job card
const renderJobCard = useCallback((assignment) => {
const job = assignment.job;
const jobMenu = (
    <Menu>
    <Menu.Item key="details" onClick={() => fetchJobDetails(job._id)}>
        View Details
    </Menu.Item>
    <Menu.Item key="withdraw" onClick={() => handleWithdrawApplication(job._id)}>
        Withdraw Application
    </Menu.Item>
    </Menu>
);

return (
    <Card
    key={job._id}
    hoverable
    extra={
        <Dropdown overlay={jobMenu} trigger={['click']}>
        <EllipsisOutlined />
        </Dropdown>
    }
    className="mb-4 transition-all duration-300 hover:shadow-lg"
    >
    <Card.Meta
        title={job.name}
        description={
        <>
            <Paragraph ellipsis={{ rows: 2 }}>
            <Text strong>Job Type:</Text> {job.jobType}
            </Paragraph>
            <div className="flex justify-between items-center">
            <Text type="secondary">
                <Text strong>Location:</Text> {job.location}
            </Text>
            <Text type="success">
                <Text strong>Pay:</Text> ${job.payRate}/hr
            </Text>
            </div>
        </>
        }
    />
    </Card>
);
}, []);

// Render card content for each job category
const renderCardContent = useCallback(({ jobs, title, emptyMessage }) => {
const filterMenu = (
    <Menu>
    <Menu.Item key="date" onClick={() => setFilterOptions(prev => ({ ...prev, sortBy: 'date', orderBy: 'desc' }))}>
        Sort by Date (Recent)
    </Menu.Item>
    <Menu.Item key="payRate" onClick={() => setFilterOptions(prev => ({ ...prev, sortBy: 'payRate', orderBy: 'desc' }))}>
        Sort by Pay Rate (High to Low)
    </Menu.Item>
    </Menu>
);

return (
    <Card 
    title={
        <div className="flex justify-between items-center">
        {title}
        <Dropdown overlay={filterMenu} trigger={['click']}>
            <Tooltip title="Filter & Sort">
            <FilterOutlined className="cursor-pointer" />
            </Tooltip>
        </Dropdown>
        </div>
    }
    className="shadow-md hover:shadow-xl transition-shadow duration-300"
    loading={isLoading}
    >
    {jobs.length > 0 ? (
        <>
        {jobs.map(renderJobCard)}
        {jobs.length === 5 && (
            <Text type="secondary" className="text-center block mt-2">
            Showing top 5 jobs. View full list for more.
            </Text>
        )}
        </>
    ) : (
        <Empty 
        description={emptyMessage} 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
    )}
    </Card>
);
}, [isLoading, renderJobCard]);

// Detailed job modal
const renderJobDetailModal = () => {
if (!selectedJob) return null;

return (
    <Modal
    title="Job Details"
    visible={isJobModalVisible}
    onCancel={() => setIsJobModalVisible(false)}
    footer={[
        <Button key="close" onClick={() => setIsJobModalVisible(false)}>
        Close
        </Button>
    ]}
    >
    <div>
        <Title level={4}>{selectedJob.job.name}</Title>
        <Paragraph>
        <Text strong>Description: </Text>
        {selectedJob.job.description}
        </Paragraph>
        <div className="flex justify-between">
        <Text><Text strong>Location:</Text> {selectedJob.job.location}</Text>
        <Text type="success"><Text strong>Pay Rate:</Text> ${selectedJob.job.payRate}/hr</Text>
        </div>
    </div>
    </Modal>
);
};

// Error rendering
if (error) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="text-center p-8 shadow-xl">
        <Title level={4} type="danger">Oh Snap! Something went wrong</Title>
        <Paragraph>{error}</Paragraph>
        <Button 
        type="primary" 
        icon={<ReloadOutlined />} 
        onClick={debouncedRefresh}
        >
        Retry Fetching
        </Button>
    </Card>
    </div>
);
}

// Main page rendering
return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
    <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <Title level={2} className="mb-0">Job Applications Dashboard</Title>
        <Button 
        type="primary" 
        icon={<PlusOutlined />}
        size="large"
        onClick={() => navigate('/find-jobs')} // Navigate to job search/application page
        >
        Find New Jobs
        </Button>
    </div>

    {/* Responsive Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderCardContent({
        jobs: jobData.recent,
        title: 'Recent Applications',
        emptyMessage: 'No recent job applications'
        })}
        {renderCardContent({
        jobs: jobData.pending,
        title: 'Pending Review',
        emptyMessage: 'No jobs pending review'
        })}
        {renderCardContent({
        jobs: jobData.opportunities,
        title: 'Potential Opportunities',
        emptyMessage: 'No additional job opportunities'
        })}
    </div>

    {/* Job Details Modal */}
    {renderJobDetailModal()}
    </div>
</div>
);
};

export default AppliedPage;