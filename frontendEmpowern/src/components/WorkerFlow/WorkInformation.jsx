import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Typography,Button,Card,Space,Row,Col,Spin,Alert,Descriptions,Tag,Modal,Tooltip } from 'antd';
import { FiMapPin,    FiCalendar,    FiDollarSign,    FiUser,    FiPhone,  FiHome } from 'react-icons/fi';

import { jobService } from '../../calls/jobCalls';
import { setSelectedJob } from '../../store/appSlice';

const { Title, Text, Paragraph } = Typography;

const WorkInformation = () => {
    const dispatch = useDispatch();
    const { projectId } = useSelector((state) => state.app);
    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            if (!projectId) {
                navigate('/labor/work-selection');
                return;
            }
            
            try {
                setLoading(true);
                const job = await jobService.getJobById(projectId);
                
                // Robust data validation
                if (!job) {
                    throw new Error('No job details found');
                }
                
                setWork(job);
                setError(null);
                dispatch(setSelectedJob(job));
            } catch (error) {
                console.error('Error fetching job by id:', error);
                setError(error.message || 'Failed to load job details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [projectId, navigate, dispatch]);

    const handleApplyClick = async () => {
        try {
            setApplying(true);
            await jobService.applyForJob(projectId);
            setModalVisible(true);
        } catch (error) {
            Modal.error({
                title: 'Application Failed',
                content: error.message || 'Unable to submit application. Please try again.',
            });
        } finally {
            setApplying(false);
        }
    };

    // Safe split and trim function with fallback
    const safeSplit = (str, separator = ',') => {
        if (!str || typeof str !== 'string') return [];
        return str.split(separator)
            .map(item => item.trim())
            .filter(item => item !== '');
    };


    const renderJobDetails = () => {
        if (loading) return <Spin fullscreen />;
        if (error) return <Alert message={error} type="error" showIcon />;
        if (!work) return <Alert message="No job information available" type="warning" />;

        // Destructure with default values for safety
        const {
            name = 'Untitled Job',
            jobType = 'Not Specified',
            location = 'Not Available',
            payRate = 0,
            startDate = new Date(),
            endDate = new Date(),
            description = 'No description available',
            skillsRequired = '',
            postedBy = {},
            imageUrl = null
        } = work || {};

        // Safe nested destructuring
        const {
            userId = {},
            companyName = 'Not Available'
        } = postedBy || {};

        const {
            firstName = '',
            lastName = '',
            mobileNumber = 'Not Available'
        } = userId || {};







        return (


            <Row justify="center">
                <Col xs={24} md={20} lg={16}>
                    <Card 
                        className="shadow-lg rounded-xl overflow-hidden"
                        cover={
                            imageUrl ? (
                                <img 
                                    alt="Job Visual" 
                                    src={imageUrl} 
                                    className="w-full h-64 object-cover"
                                />
                            ) : null
                        }
                    >
                        <Space direction="vertical" size="large" className="w-full">
                            <div className="text-center">
                                <Title level={2} className="text-primary mb-2">{name}</Title>
                                <div className="flex justify-center gap-2 mb-4">
                                    <Tag color="blue">{jobType}</Tag>
                                    <Tag color="green">Open</Tag>
                                </div>
                            </div>

                            <Descriptions 
                                column={{ xs: 1, sm: 2 }} 
                                bordered 
                                layout="vertical"
                            >
                                <Descriptions.Item 
                                    label={
                                        <span className="flex items-center">
                                            <FiMapPin className="mr-2" /> Location
                                        </span>
                                    }
                                >
                                    {location}
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={
                                        <span className="flex items-center">
                                            <FiDollarSign className="mr-2" /> Pay Rate
                                        </span>
                                    }
                                >
                                    ₹{payRate} per day
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={
                                        <span className="flex items-center">
                                            <FiCalendar className="mr-2" /> Start Date
                                        </span>
                                    }
                                >
                                    {new Date(startDate).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item 
                                    label={
                                        <span className="flex items-center">
                                            <FiCalendar className="mr-2" /> End Date
                                        </span>
                                    }
                                >
                                    {new Date(endDate).toLocaleDateString()}
                                </Descriptions.Item>
                            </Descriptions>

                            <Card 
                                title="Job Description" 
                                bordered={false} 
                                className="bg-gray-50"
                            >
                                <Paragraph>{description}</Paragraph>
                            </Card>

                            <Card 
                                title="Skills Required" 
                                bordered={false} 
                                className="bg-gray-50"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {safeSplit(skillsRequired).map(skill => (
                                        <Tag key={skill} color="purple">
                                            {skill}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>

                            {(firstName || companyName || mobileNumber) && (
                                <Card 
                                    title="Employer Details" 
                                    bordered={false} 
                                    className="bg-gray-50"
                                >
                                    <Space direction="vertical" className="w-full">
                                        {firstName && (
                                            <div className="flex items-center">
                                                <FiUser className="mr-2" />
                                                <Text strong>
                                                    {`${firstName} ${lastName}`}
                                                </Text>
                                            </div>
                                        )}
                                        {companyName && (
                                            <div className="flex items-center">
                                                <FiHome className="mr-2" />
                                                <Text>{companyName}</Text>
                                            </div>
                                        )}
                                        {mobileNumber && (
                                            <div className="flex items-center">
                                                <FiPhone className="mr-2" />
                                                <Tooltip title="Contact Employer">
                                                    <Text copyable>
                                                        {mobileNumber}
                                                    </Text>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </Space>
                                </Card>
                            )}

                            <div className="text-center mt-6">
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    loading={applying}
                                    onClick={handleApplyClick}
                                    className="bg-primary hover:bg-primary-600"
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        );
    };

    const handleModalClose = () => {
        setModalVisible(false);
        navigate('/labor/my-applications');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {renderJobDetails()}

            <Modal
                title="Application Submitted"
                open={modalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        View My Applications
                    </Button>
                ]}
            >
                <p>Your application has been successfully submitted!</p>
            </Modal>
        </div>
    );
};

export default WorkInformation;