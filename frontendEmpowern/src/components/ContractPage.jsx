import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, message, Checkbox, Spin, Alert, Modal, Divider } from 'antd';
import { FiFileText, FiCheckCircle } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { jobAssignmentService } from '../calls/JobAssignmentCalls';
import { jobService } from '../calls/jobCalls';

const { Title, Text, Paragraph } = Typography;

const ContractPage = () => {
  // React hooks for managing state and navigation
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [currentDate] = useState(new Date().toLocaleDateString());

  const formData = location.state || {};

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (formData?.projectId) {
          const jobDetails = await jobService.getJobById(formData.projectId);
          setContract(jobDetails.contract);
        }
      } catch (err) {
        setError('Failed to load contract details');
        console.error(err);
      }
    };

    fetchContract();
  }, [formData?.projectId]);

  // Generate combined contract terms using both static and fetched data
  const generateContractTerms = () => {
    if (!contract) return '';

    return `
CONTRACT AGREEMENT

Date: ${currentDate}

BETWEEN:
Worker: ${formData.name} ${formData.lastName}
Aadhaar: ${formData.aadhaar}
Contact: ${formData.additionalMobile}

AND
Project: ${formData?.projectDetails?.name || 'Project Name'}

TERMS AND CONDITIONS:

1. SCOPE OF WORK
   - The Worker agrees to provide services as per their specified skills: ${formData.specialization}
   - Work will be performed according to industry standards and safety guidelines
   ${contract.terms || ''}

2. COMPENSATION
   - Daily Wage: ₹${formData.demandedWage}
   - Payment Schedule: ${contract.paymentTerms || 'Weekly/Bi-weekly as per mutual agreement'}
   - Overtime rates will be discussed separately

3. WORKING HOURS
   - Working Hours: ${formData.preferredWorkHours || 'As per standard working hours'}
   - Availability: ${formData.availability}
   ${contract.workSchedule || ''}

4. DURATION
   - This contract is valid for the duration of the project or until terminated by either party
   - Notice period: 15 days

5. RESPONSIBILITIES
   - Worker shall maintain professional conduct
   - Follow safety protocols and guidelines
   - Report any issues or concerns promptly

6. ADDITIONAL TERMS
   ${contract.additionalRequirements || ''}
   ${formData.expectations || ''}

By signing below, both parties agree to the terms and conditions stated above.
`;
  };

  // Handle contract submission
  const handleFinish = async () => {
    setLoading(true);
    try {
      // Enhanced assignment data structure to match improved JobAssignmentService
      const assignmentData = {
        jobId: formData.projectId,
        workerId: formData.workerId,
        hourlyRate: parseFloat(formData.demandedWage),
        estimatedDuration: 30, // Default to 30 days or calculate based on project
        status: 'APPLIED',
        contractTerms: generateContractTerms(),
        metadata: {
          specialization: formData.specialization,
          extraContact: formData.additionalMobile,
          applicationDate: new Date().toISOString(),
          platform: 'web',
          ipAddress: window.clientIP || 'unknown',
          userAgent: navigator.userAgent
        },
        milestones: [], // Can be populated if project has predefined milestones
        applicationDetails: {
          ...formData,
          acceptedAt: new Date().toISOString()
        }
      };
  
      const result = await jobAssignmentService.create(assignmentData);
      
      if (result) {
        Modal.success({
          title: 'Application Submitted Successfully',
          content: 'Your application has been submitted. You can track its status in the Applied section.',
          onOk: () => navigate('/labor/main-page')
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      Modal.error({
        title: 'Application Failed',
        content: error.message || 'Failed to submit your application. Please try again.'
      });
      console.error('Application submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6">
        <Alert message={error} type="error" />
      </div>
    );
  }

  if (!contract && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        {/* Header section with icon and title */}
        <div className="mb-6 text-center">
          <FiFileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <Title level={4}>Contract Agreement</Title>
        </div>

        <Divider />

        {/* Display contract terms in a styled box */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 whitespace-pre-line font-mono text-sm">
          {generateContractTerms()}
        </div>

        <Divider />

        <div className="space-y-4">
          {/* Checkbox to agree to terms */}
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="text-sm text-gray-600"
          >
            I have read and agree to the terms and conditions
          </Checkbox>

          {/* Action buttons */}
          <div className="flex justify-between">
            <Button
              type="default"
              onClick={() => navigate(-1)}
            >
              Back to Application
            </Button>
            <Button
              type="primary"
              onClick={handleFinish}
              disabled={!agreed}
              loading={loading}
            >
              Sign Contract
              <FiCheckCircle className="ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContractPage;