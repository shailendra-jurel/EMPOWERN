import React, { useState } from 'react';
import { Button, Card, Typography, message, Checkbox } from 'antd';
import { FiFileText, FiCheckCircle } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import {jobAssignmentService  } from '../calls/JobAssignmentCalls';

const { Title, Text } = Typography;

const ContractPage = () => {
  // React hooks for managing state and navigation
  const location = useLocation(); // Retrieve data passed via route state
  const navigate = useNavigate(); // Navigate to different routes
  const [loading, setLoading] = useState(false); // Manage loading state for the submit button
  const [agreed, setAgreed] = useState(false); // Track whether the user agreed to the terms
  const formData = location.state || {}; // Retrieve form data from location state
  const [currentDate] = useState(new Date().toLocaleDateString()); // Current date for the contract

  // Contract terms template with dynamic data from formData
  const contractTerms = `
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

2. COMPENSATION
   - Daily Wage: ₹${formData.demandedWage}
   - Payment Schedule: Weekly/Bi-weekly as per mutual agreement
   - Overtime rates will be discussed separately

3. WORKING HOURS
   - Working Hours: ${formData.preferredWorkHours || 'As per standard working hours'}
   - Availability: ${formData.availability}

4. DURATION
   - This contract is valid for the duration of the project or until terminated by either party
   - Notice period: 15 days

5. RESPONSIBILITIES
   - Worker shall maintain professional conduct
   - Follow safety protocols and guidelines
   - Report any issues or concerns promptly

6. ADDITIONAL TERMS
   ${formData.expectations || 'No additional terms specified'}

By signing below, both parties agree to the terms and conditions stated above.
`;

  // Handle contract submission
  const handleFinish = async () => {
    setLoading(true);
    try {
      const assignment = {
        worker: formData.workerId,
        job: formData.projectId,
        demandedWage: formData.demandedWage,
        extraContact: formData.additionalMobile,
        status: 'Pending',
        contractTerms: contractTerms,
        assignmentDate: new Date().toISOString(),
      };
  
      const result = await jobAssignmentService.create(assignment);
      
      if (result) {
        message.success('Application submitted successfully!');
        navigate('/labor/applied');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      message.error('Error submitting application');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        {/* Header section with icon and title */}
        <div className="mb-6 text-center">
          <FiFileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <Title level={4}>Contract Agreement</Title>
        </div>

        {/* Display contract terms in a styled box */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 whitespace-pre-line font-mono text-sm">
          {contractTerms}
        </div>

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
              onClick={() => navigate(-1)} // Navigate back to the previous page
            >
              Back to Application
            </Button>
            <Button
              type="primary"
              onClick={handleFinish}
              disabled={!agreed} // Disable button if terms are not agreed
              loading={loading} // Show loading spinner when submitting
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