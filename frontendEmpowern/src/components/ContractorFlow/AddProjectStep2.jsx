import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Select, Input, Button, Typography, message, Upload, DatePicker, Checkbox } from 'antd';
import { jobService } from '../../calls/jobCalls';
import { setProjectId } from '../../store/appSlice';
import { useSelector, useDispatch } from 'react-redux';

const { Title } = Typography;
const { Option } = Select;

const AddProject = () => {
  const contractorId = useSelector((state) => state.app.contractorId);
//   const userId = useSelector((state) => state.app?.id);
  const [projectDetails, setDetails] = useState({
    jobType: '',
    name: '',
    location: '',
    workersRequired: '',
    payRate: '',
    accomodation: false,
    transportation: false,
    startDate: null,
    endDate: null,
    status : 'open',
    postedBy : contractorId,
  });

  const [errors, setErrors] = useState({
    workersRequired: '',
    payRate: '',
    images: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails({ ...projectDetails, [name]: value });

    // Validate the input fields
    if (name === 'workersRequired' || name === 'payRate') {
      if (!/^\d+$/.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} should only contain numbers.` }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSelectChange = (name, value) => {
    setDetails({ ...projectDetails, [name]: value });
  };

  const handleCheckboxChange = (name, value) => {
    setDetails({ ...projectDetails, [name]: value });
  };

  const handleDateChange = (name, value) => {
    setDetails({ ...projectDetails, [name]: value });
  };

  const handleUpload = ({ fileList }) => {
    setDetails({ ...projectDetails, images: fileList });
  };

  const handleProceed = async () => {
    if (!contractorId) {
        message.error('Please login first');
        return;
    }

    const requiredFields = [
        'jobType', 'name', 'location', 'workersRequired',
        'payRate', 'startDate', 'endDate'
    ];
    
    const missingFields = requiredFields.filter(field => !projectDetails[field]);
    
    if (missingFields.length > 0) {
        message.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }

    try {
        const jobData = {
            ...projectDetails,
            payRate: parseFloat(projectDetails.payRate),
            workersRequired: parseInt(projectDetails.workersRequired, 10),
            postedBy: contractorId,
            startDate: projectDetails.startDate.toISOString(),
            endDate: projectDetails.endDate.toISOString(),
            status: 'Open'
        };

        const createdJob = await jobService.applyForJob(jobData);
        if (createdJob) {
            dispatch(setProjectId(createdJob._id));
            message.success('Job created successfully!');
            navigate('/contractor/add-project-step3');
        }
    } catch (error) {
        message.error('Failed to create job: ' + error.message);
        console.error('Error creating job:', error);
    }
};

  return (
    <div style={{ padding: '16px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Add New Project</Title>
      <Form layout="vertical">
        <Form.Item label="Job Type" required>
          <Select
            placeholder="Select a job type"
            value={projectDetails.jobType}
            onChange={(value) => handleSelectChange('jobType', value)}
          >
            <Option value="construction">Construction</Option>
            <Option value="hospitality">Hospitality</Option>
            <Option value="agriculture">Agriculture</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Project Name" required>
          <Input
            name="name"
            placeholder="Enter project name"
            value={projectDetails.name}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Location" required>
          <Input
            name="location"
            placeholder="Enter location"
            value={projectDetails.location}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Number of Workers Required" required help={errors.workersRequired} validateStatus={errors.workersRequired ? 'error' : ''}>
          <Input
            name="workersRequired"
            placeholder="Enter number of workers required"
            value={projectDetails.workersRequired}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Pay Rate (per day)" required help={errors.payRate} validateStatus={errors.payRate ? 'error' : ''}>
          <Input
            name="payRate"
            placeholder="Enter pay rate"
            value={projectDetails.payRate}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Accommodation" >
          <Checkbox
            checked={projectDetails.accomodation}
            onChange={(e) => handleCheckboxChange('accomodation', e.target.checked)}
          >
            Provided
          </Checkbox>
        </Form.Item>
        <Form.Item label="Transportation" >
          <Checkbox
            checked={projectDetails.transportation}
            onChange={(e) => handleCheckboxChange('transportation', e.target.checked)}
          >
            Provided
          </Checkbox>
        </Form.Item>
        <Form.Item label="Start Date" required>
          <DatePicker
            style={{ width: '100%' }}
            value={projectDetails.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
          />
        </Form.Item>
        <Form.Item label="End Date" required>
          <DatePicker
            style={{ width: '100%' }}
            value={projectDetails.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleProceed} style={{ width: '100%' }}>
            Proceed
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProject;