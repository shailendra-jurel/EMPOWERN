import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Steps,
  Card,
  Typography,
  Checkbox,
  message,
  Spin,
  Upload,
  Divider,Result
} from 'antd';
import { UploadOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { jobService } from '../../calls/jobCalls';
import { setProjectId } from '../../store/appSlice';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateProject = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const contractorId = useSelector((state) => state.user?.id || state.app?.contractorId);
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const existingProjectId = useSelector((state) => state.app.projectId);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contractFile, setContractFile] = useState(null);
   const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [error, setError] = useState(null);
  

 // Verify contractor ID and authentication
//   useEffect(() => {
//     if (!contractorId) {
//       setError('Contractor ID not found. Please make sure you are logged in.');
//       return;
//     }
    
//     if (!isAuthenticated) {
//       message.error('Authentication required');
//       navigate('/login');
//     }
//   }, [contractorId,isAuthenticated, navigate]);



 // Load existing project data if available
  useEffect(() => {
    const loadExistingProject = async () => {
      if (existingProjectId && !initialDataLoaded) {
        try {
          setLoading(true);
          const jobData = await jobService.getJobById(existingProjectId);
          if (jobData) {
            // Transform dates from ISO strings to moment objects for DatePicker
            const formattedData = {
              ...jobData,
              startDate: jobData.startDate ? moment(jobData.startDate) : null,
              endDate: jobData.endDate ? moment(jobData.endDate) : null
            };
            form.setFieldsValue(formattedData);
          }
          setInitialDataLoaded(true);
        } catch (error) {
          setError('Error loading project details: ' + error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadExistingProject();
  }, [existingProjectId, form, initialDataLoaded]);

  const initialValues = {
    // Basic Project Details
    jobType: undefined,
    name: '',
    location: '',
    workersRequired: '',
    payRate: '',
    skillsRequired: '',
    description: '',
    
    // Facilities & Duration
    accomodation: false,
    transportation: false,
    foodProvided: false,
    medicalInsurance: false,
    startDate: null,
    endDate: null,
    
    // Contract Details
    contractDetails: {
      duration: '',
      terms: '',
      responsibilities: '',
      benefits: '',
      workingHours: '',
      overtimeRate: '',
      safetyMeasures: '',
      terminationClauses: '',
      disputeResolution: ''
    },
    
    // Owner Details
    ownerDetails: {
      name: '',
      mobile: '',
      company: '',
      email: '',
      alternateContact: ''
    }
  };

  // Validation helper for each step
  const validateStep = async () => {
    try {
      const currentFields = getFieldsForStep(currentStep);
      await form.validateFields(currentFields);
      return true;
    } catch (error) {
      const firstError = Object.keys(error.errorFields)[0];
      form.scrollToField(firstError);
      return false;
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ['name', 'jobType', 'location', 'workersRequired', 'payRate', 'skillsRequired', 'description'];
      case 1:
        return ['startDate', 'endDate', 'accomodation', 'transportation', 'foodProvided', 'medicalInsurance'];
      case 2:
        return Object.keys(initialValues.contractDetails).map(key => `contractDetails.${key}`);
      case 3:
        return Object.keys(initialValues.ownerDetails).map(key => `ownerDetails.${key}`);
      default:
        return [];
    }
  };

  const handleNext = async () => {
    if (await validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Enhanced error handling for job creation
   const handleSubmit = async () => {
    //  if (!contractorId) {
    //    message.error('Contractor ID not found. Please make sure you are logged in.');
    //    return;
    //  }
 
     try {
       setLoading(true);
       const values = await form.validateFields();
       
       const jobData = {
         ...values,
         payRate: parseFloat(values.payRate),
         workersRequired: parseInt(values.workersRequired, 10),
         postedBy: contractorId,
         startDate: values.startDate.toISOString(),
         endDate: values.endDate.toISOString(),
         status: 'Open',
         contractFile: contractFile
       };
 
       let response;
       if (existingProjectId) {
         response = await jobService.updateJob(existingProjectId, jobData);
         message.success('Project updated successfully!');
       } else {
         response = await jobService.applyForJob(jobData);
         message.success('Project created successfully!');
       }
 
       if (response) {
         dispatch(setProjectId(response._id));
         navigate('/contractor/project-list');
       }
     } catch (error) {
       if (error.errorFields) {
         message.error('Please fill in all required fields correctly.');
       } else {
         message.error('Failed to save project: ' + error.message);
       }
     } finally {
       setLoading(false);
     }
   };

    // Handle file upload with better error checking
     const handleFileUpload = (file) => {
       const isValidFileType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
       const isLessThan2MB = file.size / 1024 / 1024 < 2;
   
       if (!isValidFileType) {
         message.error('You can only upload PDF or Word documents!');
         return Upload.LIST_IGNORE;
       }
   
       if (!isLessThan2MB) {
         message.error('File must be smaller than 2MB!');
         return Upload.LIST_IGNORE;
       }
   
       setContractFile(file);
       return false;
     };


     // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-2xl mx-auto">
          <Result
            status="error"
            title="Error"
            subTitle={error}
            extra={[
              <Button type="primary" key="console" onClick={() => navigate('/login')}>
                Go to Login
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  const steps = [
    {
      title: 'Basic Details',
      content: (
        <>
          <Form.Item name="jobType" label="Job Type" rules={[{ required: true }]}>
            <Select placeholder="Select job type">
              <Option value="construction">Construction</Option>
              <Option value="hospitality">Hospitality</Option>
              <Option value="agriculture">Agriculture</Option>
              <Option value="manufacturing">Manufacturing</Option>
              <Option value="logistics">Logistics</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="name" label="Project Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Project Description" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="skillsRequired" label="Required Skills" rules={[{ required: true }]}>
            <TextArea placeholder="List required skills and experience" />
          </Form.Item>

          <Form.Item
            name="workersRequired"
            label="Number of Workers"
            rules={[
              { required: true },
              { pattern: /^\d+$/, message: 'Please enter a valid number' }
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="payRate"
            label="Daily Pay Rate (₹)"
            rules={[
              { required: true },
              { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount' }
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </>
      )
    },
    {
      title: 'Facilities & Duration',
      content: (
        <>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Title level={5}>Facilities Provided</Title>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="accomodation" valuePropName="checked">
              <Checkbox>Accommodation</Checkbox>
            </Form.Item>

            <Form.Item name="transportation" valuePropName="checked">
              <Checkbox>Transportation</Checkbox>
            </Form.Item>

            <Form.Item name="foodProvided" valuePropName="checked">
              <Checkbox>Food</Checkbox>
            </Form.Item>

            <Form.Item name="medicalInsurance" valuePropName="checked">
              <Checkbox>Medical Insurance</Checkbox>
            </Form.Item>
          </div>
        </>
      )
    },
    {
      title: 'Contract Details',
      content: (
        <>
          <Form.Item
            name={['contractDetails', 'duration']}
            label="Contract Duration"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., 3 months, 6 months, 1 year" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'workingHours']}
            label="Working Hours"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., 8 hours per day, 48 hours per week" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'overtimeRate']}
            label="Overtime Rate"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., 1.5x regular pay rate" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'terms']}
            label="Contract Terms"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="Specify important contract terms and conditions" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'responsibilities']}
            label="Worker Responsibilities"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="List key responsibilities and expectations" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'benefits']}
            label="Additional Benefits"
          >
            <TextArea rows={4} placeholder="List any additional benefits provided" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'safetyMeasures']}
            label="Safety Measures"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="Describe safety protocols and equipment provided" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'terminationClauses']}
            label="Termination Clauses"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="Specify conditions for contract termination" />
          </Form.Item>

          <Form.Item
            name={['contractDetails', 'disputeResolution']}
            label="Dispute Resolution"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder="Outline the process for resolving disputes" />
          </Form.Item>

          <Form.Item label="Upload Contract Template">
            <Upload
              beforeUpload={(file) => {
                setContractFile(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Contract Document</Button>
            </Upload>
          </Form.Item>
        </>
      )
    },
    {
      title: 'Owner Details',
      content: (
        <>
          <Form.Item
            name={['ownerDetails', 'name']}
            label="Owner Name"
            rules={[
              { required: true },
              { pattern: /^[a-zA-Z\s]+$/, message: 'Name should only contain alphabets' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['ownerDetails', 'mobile']}
            label="Mobile Number"
            rules={[
              { required: true },
              { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit mobile number' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['ownerDetails', 'email']}
            label="Email"
            rules={[
              { required: true },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['ownerDetails', 'company']}
            label="Company Name"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={['ownerDetails', 'alternateContact']}
            label="Alternate Contact"
            rules={[
              { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit mobile number' }
            ]}
          >
            <Input />
          </Form.Item>
        </>
      )
    }
  ];

 // Show loading state
 if (loading && !initialDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-4xl mx-auto shadow-lg">
      <Title level={2} className="text-center mb-8">
          {existingProjectId ? 'Edit Project' : 'Create New Project'}
        </Title>
        <Steps
          current={currentStep}
          items={steps.map(item => ({ title: item.title }))}
          className="mb-8"
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          className="max-w-2xl mx-auto"
          onFinishFailed={(errorInfo) => {
            form.scrollToField(errorInfo.errorFields[0].name);
          }}
        >
          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(prev => prev - 1)}>
                Previous
            </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={handleNext}  loading={loading}>
                Next
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                onClick={handleSubmit}
                icon={<SendOutlined />}
                loading={loading}
              >
                {existingProjectId ? 'Update Project' : 'Create Project'}
                </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};
export default CreateProject;