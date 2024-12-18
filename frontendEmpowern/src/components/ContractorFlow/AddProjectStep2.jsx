import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Select, Input, Button, Typography, message, Upload, DatePicker, Checkbox } from 'antd';
import { createJob } from '../../calls/jobCalls';
// import {useAppContext} from '../GlobalContext';
import { setProjectId } from '../../store/appSlice';
import { useSelector , useDispatch } from 'react-redux';
const { Title } = Typography;
const { Option } = Select;

const AddProject = () => {
// const {contractorId,setProjectId} = useAppContext();
const contractorId = useSelector((state) => state.user.id);
console.log('contractorId',contractorId);
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
console.log('name', name, 'value', value);
setDetails({ ...projectDetails, [name]: value });
};

const handleDateChange = (name, value) => {
setDetails({ ...projectDetails, [name]: value });
};

const handleUpload = ({ fileList }) => {
setDetails({ ...projectDetails, images: fileList });
};

const handleProceed = async () => {
const allFieldsFilled = Object.values(projectDetails).every(field => field !== '' && field.length !== 0);
const noErrors = Object.values(errors).every(error => error === '');

if (allFieldsFilled && noErrors) {
    try {
    const jobData = {
        jobType: projectDetails.jobType,
        location: projectDetails.location,
        payRate: parseFloat(projectDetails.payRate),
        skillsRequired: projectDetails.name,
        workersRequired: parseInt(projectDetails.workersRequired, 10),
        accomodation: projectDetails.accomodation,
        transportation: projectDetails.transportation,
        startDate: projectDetails.startDate ? projectDetails.startDate.toISOString() : null,
        endDate: projectDetails.endDate ? projectDetails.endDate.toISOString() : null,
    };

    const createdJob = await createJob(jobData);
    if (createdJob) {
        console.log('createdJob',createdJob);
        dispatch(setProjectId(createdJob._id))
        console.log('Job created:', createdJob);
        navigate('/contractor/add-project-step3', { state: { job: createdJob, projectDetails } });
    } else {
        message.error('Failed to create job. Please try again.');
    }
    } catch (error) {
    message.error('Failed to create job. Please try again.');
    console.error('Error creating job:', error);
    }
} else {
    message.warning('Please fill in all fields and upload at least one image.');
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
