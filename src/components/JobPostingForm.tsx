import React, { useState, useEffect } from 'react';
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
import { uploadFile } from '../api/jobs';

interface JobPostingFormProps {
  onCancel: () => void; // Renamed for clarity when used in a dialog
  onSave: (jobData: JobFormData) => void; // Made onSave required
  initialData?: Partial<JobFormData>; // Added for editing
  forceSubmit?: boolean; // Allow bypassing validation when editing
}

interface JobFormData {
  title: string;
  organization: string;
  sector: JobSector;
  category: JobCategory;
  location: string;
  qualification: string;
  experience: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  speciality: string;
  dutyType: 'full_time' | 'part_time' | 'contract';
  numberOfPosts: number;
  gender?: string;
  salary: string;
  description: string;
  lastDate: string;
  requirements: string;
  benefits: string;
  contactEmail: string;
  contactPhone: string;
  pdfUrl?: string;
  imageUrl?: string;
  applyLink?: string;
  pdfFile?: File | null;
  imageFile?: File | null;
}

export function JobPostingForm({ onCancel, onSave, initialData, forceSubmit }: JobPostingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    organization: '',
    sector: 'private',
    category: 'Medical Officer',
    location: '',
    qualification: '',
    experience: '',
    experienceLevel: 'entry',
    speciality: '',
    dutyType: 'full_time',
    numberOfPosts: 1,
    gender: '',
    salary: '',
    description: '',
    lastDate: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    contactPhone: '',
    pdfFile: null,
    imageFile: null
  });

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | undefined>(undefined);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(undefined);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100; // Calculate progress based on current step

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

  // Initialize form data with initialData if provided (for editing)
  useEffect(() => {
    if (initialData) {
      console.log('Initializing form with data:', initialData);
      
      // Ensure all fields have defined values to prevent controlled/uncontrolled input warnings
      const sanitizedData = {
        title: initialData.title ?? '',
        organization: initialData.organization ?? '',
        sector: initialData.sector ?? 'private',
        category: initialData.category ?? 'Medical Officer',
        location: initialData.location ?? '',
        qualification: initialData.qualification ?? '',
        experience: initialData.experience ?? '',
        experienceLevel: initialData.experienceLevel ?? 'entry',
        speciality: initialData.speciality ?? '',
        dutyType: initialData.dutyType ?? 'full_time',
        numberOfPosts: initialData.numberOfPosts ?? 1,
        gender: initialData.gender ?? '',
        salary: initialData.salary ?? '',
        description: initialData.description ?? '',
        lastDate: initialData.lastDate ?? '',
        requirements: initialData.requirements ?? '',
        benefits: initialData.benefits ?? '',
        contactEmail: initialData.contactEmail ?? '',
        contactPhone: initialData.contactPhone ?? '',
        pdfUrl: initialData.pdfUrl ?? '',
        imageUrl: initialData.imageUrl ?? '',
        applyLink: initialData.applyLink ?? ''
      };
      
      setFormData(prev => ({ ...prev, ...sanitizedData }));
      
      // Set preview URLs if they exist
      if (initialData.pdfUrl) {
        setPdfPreviewUrl(initialData.pdfUrl);
      }
      if (initialData.imageUrl) {
        setImagePreviewUrl(initialData.imageUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [pdfPreviewUrl, imagePreviewUrl]);

  // Resolve file URLs to absolute URLs for proper display (for existing URLs when editing)
  const resolveFileUrl = (url?: string): string => {
    if (!url) return '';

    // 1. If it's already a full absolute URL or blob URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }

    // 2. Get the API base URL from the environment
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

    // 3. Handle /uploads/ paths - convert to absolute backend URL
    // Backend serves files via /uploads/** through WebConfig
    if (url.startsWith('/uploads/')) {
      const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
      return `${base}${url}`;
    }

    // 4. Handle /api/jobs/files/ paths (alternative endpoint)
    if (url.startsWith('/api/jobs/files/')) {
      const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
      return `${base}${url}`;
    }

    // 5. For other relative paths, prepend API base
    const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const path = url.startsWith('/') ? url : `/${url}`;
    
    // Construct the absolute URL
    return `${base}${path}`;
  };

  const handleInputChange = (field: keyof JobFormData, value: string | number | undefined) => {
    // Ensure we never pass undefined to controlled inputs
    let sanitizedValue: string | number;
    
    if (value === undefined || value === null) {
      // Set appropriate default based on field type
      if (field === 'numberOfPosts') {
        sanitizedValue = 1;
      } else {
        sanitizedValue = '';
      }
    } else {
      sanitizedValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
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

  const handleSubmit = async () => {
    try {
      // Upload files first
      let pdfUrl = formData.pdfUrl;
      let imageUrl = formData.imageUrl;

      if (formData.pdfFile) {
        const pdfResponse = await uploadFile(formData.pdfFile);
        pdfUrl = pdfResponse.url;
      }

      if (formData.imageFile) {
        const imageResponse = await uploadFile(formData.imageFile);
        imageUrl = imageResponse.url;
      }

      // Prepare job data with uploaded URLs
      const jobData = {
        ...formData,
        pdfUrl,
        imageUrl,
      };

      if (onSave) {
        onSave(jobData);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      // Handle error - maybe show a toast or alert
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.organization && formData.category && formData.location;
      case 2:
        return formData.qualification;
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
          <Select value={formData.sector || 'private'} onValueChange={(value: JobSector) => handleInputChange('sector', value)}>
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
          <Select value={formData.category || 'Medical Officer'} onValueChange={(value: JobCategory) => handleInputChange('category', value)}>
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
          <Select value={formData.location || ''} onValueChange={(value: string) => handleInputChange('location', value)}>
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
          <Label htmlFor="experience">Experience Required</Label>
          <Input
            id="experience"
            placeholder="e.g., 2-5 years"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <Select value={formData.experienceLevel || 'entry'} onValueChange={(value: 'entry' | 'mid' | 'senior' | 'executive') => handleInputChange('experienceLevel', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="executive">Executive Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="speciality">Speciality</Label>
          <Input
            id="speciality"
            placeholder="e.g., Cardiology, Neurology"
            value={formData.speciality}
            onChange={(e) => handleInputChange('speciality', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="dutyType">Duty Type</Label>
          <Select value={formData.dutyType || 'full_time'} onValueChange={(value: 'full_time' | 'part_time' | 'contract') => handleInputChange('dutyType', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select duty type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="numberOfPosts">Number of Posts</Label>
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

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender || ''} onValueChange={(value: string) => handleInputChange('gender', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select gender preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
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

        <div className="md:col-span-2">
          <Label htmlFor="pdfFile">Upload PDF Document</Label>
          <Input
            id="pdfFile"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFormData(prev => ({ ...prev, pdfFile: file }));
              if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
              setPdfPreviewUrl(file ? URL.createObjectURL(file) : undefined);
            }}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Upload official notification PDF or job description (optional)</p>
          {(pdfPreviewUrl || formData.pdfUrl) && (
            <div className="mt-3">
              <a
                href={pdfPreviewUrl || resolveFileUrl(formData.pdfUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View selected PDF
              </a>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="imageFile">Upload Image</Label>
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFormData(prev => ({ ...prev, imageFile: file }));
              if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
              setImagePreviewUrl(file ? URL.createObjectURL(file) : undefined);
            }}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Upload hospital/organization image (optional)</p>
          {(imagePreviewUrl || formData.imageUrl) && (
            <a href={imagePreviewUrl || formData.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
              <img
                src={imagePreviewUrl || formData.imageUrl}
                alt="Selected preview"
                className="max-h-40 rounded border hover:opacity-80 transition-opacity"
              />
            </a>
          )}
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
          <Button variant="outline" onClick={onCancel}>
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
            <Button type="button" variant="outline" onClick={onCancel}> {/* Use onCancel for the 'Save as Draft' or 'Cancel' action */}
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={!forceSubmit && !isStepValid(currentStep)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!forceSubmit && !isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                {initialData ? 'Update Job' : 'Post Job'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
