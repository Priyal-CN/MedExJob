import { useState } from 'react';
import { ArrowLeft, ArrowRight, Save, Eye, MapPin, Briefcase, GraduationCap, DollarSign, Calendar, FileText, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { JobCategory, JobSector } from '../types';

interface JobPostingFormProps {
  onNavigate: (page: string) => void;
  onSave?: (jobData: any) => void;
}

interface JobFormData {
  title: string;
  organization: string;
  sector: JobSector;
  category: JobCategory;
  location: string;
  qualification: string;
  experience: string;
  numberOfPosts: number;
  salary: string;
  description: string;
  lastDate: string;
  requirements: string;
  benefits: string;
  contactEmail: string;
  contactPhone: string;
}

export function JobPostingForm({ onNavigate, onSave }: JobPostingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    organization: '',
    sector: 'private',
    category: 'Medical Officer',
    location: '',
    qualification: '',
    experience: '',
    numberOfPosts: 1,
    salary: '',
    description: '',
    lastDate: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    contactPhone: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const jobCategories: JobCategory[] = [
    'Junior Resident',
    'Senior Resident', 
    'Medical Officer',
    'Faculty',
    'Specialist',
    'AYUSH',
    'Paramedical / Nursing'
  ];

  const locations = [
    'New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
    'Jaipur', 'Chandigarh', 'Lucknow', 'Ahmedabad', 'Kochi', 'Bhubaneswar', 'Indore'
  ];

  const handleInputChange = (field: keyof JobFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would save the job and send for approval
    console.log('Job data:', formData);
    if (onSave) {
      onSave(formData);
    }
    alert('Job posted successfully! It will be reviewed by admin before going live.');
    onNavigate('dashboard');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.organization && formData.category && formData.location;
      case 2:
        return formData.qualification && formData.experience && formData.numberOfPosts > 0;
      case 3:
        return formData.description && formData.lastDate;
      case 4:
        return formData.contactEmail && formData.contactPhone;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Basic Job Information</h2>
        <p className="text-gray-600">Let's start with the essential details about your job posting.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Senior Resident - Cardiology"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="organization">Organization/Hospital Name *</Label>
          <Input
            id="organization"
            placeholder="e.g., Apollo Hospitals"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="sector">Job Sector *</Label>
          <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value as JobSector)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="government">Government</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Job Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value as JobCategory)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {jobCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="location">Location *</Label>
          <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Requirements & Details</h2>
        <p className="text-gray-600">Specify the qualifications and experience required for this position.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="qualification">Required Qualification *</Label>
          <Input
            id="qualification"
            placeholder="e.g., MBBS, MD/DNB Medicine"
            value={formData.qualification}
            onChange={(e) => handleInputChange('qualification', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="experience">Experience Required *</Label>
          <Input
            id="experience"
            placeholder="e.g., 2-5 years"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="numberOfPosts">Number of Posts *</Label>
          <Input
            id="numberOfPosts"
            type="number"
            min="1"
            placeholder="1"
            value={formData.numberOfPosts}
            onChange={(e) => handleInputChange('numberOfPosts', parseInt(e.target.value) || 1)}
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="salary">Salary Range</Label>
          <Input
            id="salary"
            placeholder="e.g., ₹8-12 LPA or ₹50,000 - ₹80,000 per month"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="requirements">Additional Requirements</Label>
          <Textarea
            id="requirements"
            placeholder="List any specific skills, certifications, or other requirements..."
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Job Description & Timeline</h2>
        <p className="text-gray-600">Provide detailed information about the role and application deadline.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="description">Job Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="mt-1"
            rows={6}
          />
        </div>

        <div>
          <Label htmlFor="benefits">Benefits & Perks</Label>
          <Textarea
            id="benefits"
            placeholder="List benefits like health insurance, accommodation, professional development opportunities..."
            value={formData.benefits}
            onChange={(e) => handleInputChange('benefits', e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="lastDate">Last Date to Apply *</Label>
          <Input
            id="lastDate"
            type="date"
            value={formData.lastDate}
            onChange={(e) => handleInputChange('lastDate', e.target.value)}
            className="mt-1"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">Provide contact details for applications and inquiries.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="hr@yourhospital.com"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="contactPhone">Contact Phone *</Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Job Preview */}
      <div className="mt-8">
        <h3 className="text-lg text-gray-900 mb-4">Job Preview</h3>
        <Card className="p-6 border-2 border-dashed border-gray-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                {formData.sector === 'government' ? 'Government' : 'Private'}
              </Badge>
              <Badge variant="outline">{formData.category}</Badge>
            </div>
            
            <div>
              <h4 className="text-xl text-gray-900">{formData.title || 'Job Title'}</h4>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Building2 className="w-4 h-4" />
                {formData.organization || 'Organization Name'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{formData.location || 'Location'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{formData.numberOfPosts} Post{formData.numberOfPosts !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>{formData.qualification || 'Qualification'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Apply by: {formData.lastDate ? new Date(formData.lastDate).toLocaleDateString('en-IN') : 'Date'}</span>
              </div>
            </div>

            {formData.salary && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{formData.salary}</span>
              </div>
            )}

            {formData.description && (
              <div>
                <p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Post a New Job</h1>
            <p className="text-gray-600">Create a compelling job posting to attract the best medical professionals</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Content */}
        <Card className="p-8">
          {renderCurrentStep()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


