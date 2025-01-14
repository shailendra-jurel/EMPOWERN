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
  Divider,
  Result
} from 'antd';
import { UploadOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const existingProjectId = useSelector((state) => state.app.projectId);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Verify contractor ID and authentication
  useEffect(() => {
    if (!contractorId) {
      setError('Contractor ID not found. Please make sure you are logged in.');
      return;
    }

    if (!isAuthenticated) {
      message.error('Authentication required');
      navigate('/login', { state: { from: '/contractor/create-project' } });
    }
  }, [contractorId, isAuthenticated, navigate]);

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
    // ... (previous initialValues remain the same)
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

  // Enhanced error handling for job creation
  const handleSubmit = async () => {
    if (!contractorId) {
      message.error('Contractor ID not found. Please make sure you are logged in.');
      return;
    }

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
          {/* Rest of the form content remains the same */}
          
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(prev => prev - 1)}>
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button 
                type="primary" 
                onClick={handleNext}
                loading={loading}
              >
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