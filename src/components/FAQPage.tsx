import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import React, { useState } from 'react';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I create an account on MedExJob.com?",
    answer: "To create an account, click on the 'Register' button in the top navigation. Choose your role (Candidate, Employer, or Admin) and fill in the required information including your email, password, and basic profile details. You must provide mandatory consent through checkboxes, which are versioned and timestamped. You'll receive a confirmation email to verify your account."
  },
  {
    question: "Is registration free for job seekers?",
    answer: "Yes, creating an account and searching for jobs is completely free for candidates. You can apply to unlimited jobs, save job searches, and set up job alerts at no cost. All candidate features are free of charge."
  },
  {
    question: "How do employers post jobs on the platform?",
    answer: "Employers need to register and verify their account through our KYC process. Once verified, they can access the employer dashboard and post jobs. Different subscription plans offer varying numbers of job postings and additional features. All job postings must comply with medical advertising laws and our content guidelines."
  },
  {
    question: "What types of jobs are available on MedExJob.com?",
    answer: "We specialize in healthcare and medical jobs including doctors, nurses, pharmacists, medical technicians, administrative staff, and other healthcare professionals. We have both government and private sector opportunities across India. All jobs are verified before publication."
  },
  {
    question: "How do I apply for a job?",
    answer: "Once you find a job you're interested in, click on 'Apply Now' or 'View Details' to see the full job description. Upload your resume and fill in any additional information requested. Your application will be sent directly to the employer. Make sure all information in your application is truthful and accurate."
  },
  {
    question: "Can I save jobs for later?",
    answer: "Yes, you can save jobs by clicking the heart icon or 'Save for Later' button. All saved jobs can be accessed from your dashboard under the 'Saved Jobs' section. This feature helps you organize and track job opportunities you're interested in."
  },
  {
    question: "How do I track my job applications?",
    answer: "Log in to your account and go to your dashboard. You'll find an 'Applied Jobs' section where you can see the status of all your applications, including pending, shortlisted, interviewed, and rejected applications. You'll also receive email notifications about application status updates."
  },
  {
    question: "What should I include in my resume?",
    answer: "Your resume should include your contact information, professional summary, work experience, education, certifications, skills, and any relevant licenses. Make sure all information is accurate and up-to-date. False information may result in account suspension."
  },
  {
    question: "How do employers find candidates?",
    answer: "Employers can search through candidate profiles, review applications received for their job postings, and use filters to find candidates with specific qualifications, experience levels, and locations. Employers must verify their accounts and comply with our terms of service."
  },
  {
    question: "What are the subscription plans for employers?",
    answer: "We offer various subscription plans including Basic (limited job postings), Professional (more postings and features), and Enterprise (unlimited postings with advanced analytics). All subscription fees are processed securely through Razorpay/Stripe. Contact us for detailed pricing and features."
  },
  {
    question: "What is your refund policy?",
    answer: "Subscription fees are generally non-refundable, except as required by applicable consumer protection laws. If you experience technical issues preventing service use, contact support within 7 days for refund consideration. All billing disputes must be raised within 30 days of the charge date."
  },
  {
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password. For security, the reset link expires after a set time period."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data security seriously. We use enterprise-grade encryption, secure servers, regular security assessments, and access controls to protect your personal information. We never sell or rent your data. Please review our comprehensive Privacy Policy for detailed information about data protection."
  },
  {
    question: "What are my data protection rights?",
    answer: "You have comprehensive rights including: Right of Access (view your data through dashboard tools), Right of Rectification (correct inaccurate data), Right to Erasure (request data deletion), Right to Data Portability (receive your data in machine-readable format), Right to Object (object to processing), and Right to Withdraw Consent. All rights can be exercised through your dashboard."
  },
  {
    question: "How long is my data retained?",
    answer: "Active users: Data retained while account is active. Inactive accounts: Personal data anonymized after 24 months of inactivity. Deleted accounts: Soft delete for 30 days (reversible), then permanent deletion after additional 30 days. HR and billing data: Retained for 7 years for legal compliance. Please see our Privacy Policy for complete details."
  },
  {
    question: "What cookies do you use?",
    answer: "We use essential cookies (required for site functionality), functional cookies (for enhanced features), and analytics cookies (disabled by default, require your consent). Tracking is disabled by default, and you can manage cookie preferences through your account settings or browser settings at any time."
  },
  {
    question: "Can employers ask me to pay for a job?",
    answer: "No! Employers are strictly prohibited from soliciting payments from job seekers. No legitimate job should require payment from candidates. If you encounter any employer asking for payment, please report it immediately. Such behavior violates our terms and may result in immediate account suspension."
  },
  {
    question: "What happens if my account is suspended?",
    answer: "If your account is suspended, you'll receive a notification explaining the reason. You can submit an appeal through your dashboard or email medexjob1997@gmail.com. We acknowledge appeals within 24 hours and aim to resolve them within 72 hours. Our process is transparent, and we'll inform you of steps required for reinstatement."
  },
  {
    question: "Can I update my profile information?",
    answer: "Yes, you can update your profile information anytime from your dashboard. Go to 'Profile' section to edit your personal details, resume, preferences, and account settings. You can also manage your consent preferences and data protection rights through the dashboard."
  },
  {
    question: "How do I withdraw my consent?",
    answer: "You can withdraw your consent at any time through your dashboard settings. Navigate to 'Privacy & Consent' section where you can view your consent history, manage cookie preferences, and withdraw specific consents. Withdrawal does not affect the lawfulness of processing based on consent before withdrawal."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact us through the 'Contact Us' section on our website, email us at medexjob1997@gmail.com, or call +91 9588015208. For privacy concerns, data protection rights, or legal matters, please use the same email address. Our support hours are Monday-Friday, 9:00 AM - 6:00 PM IST with a 24-hour response time."
  },
  {
    question: "What if I have issues with my account?",
    answer: "If you experience any issues with your account, please contact our support team immediately at medexjob1997@gmail.com. We'll help resolve login issues, account verification problems, technical difficulties, or any other concerns. All support requests are acknowledged within 24 hours."
  },
  {
    question: "How do you ensure compliance with medical advertising laws?",
    answer: "All paid features and job postings on our platform comply with medical advertising laws and regulations. Our content moderation team reviews all job postings, and our Data Protection Officer (DPO) oversees compliance. Any violations are subject to immediate removal and account action."
  },
  {
    question: "What if I want to delete my account?",
    answer: "You can request account deletion through your dashboard settings under 'Account Management'. After deletion request, your account enters a 30-day soft delete period (reversible). After this period, your data is permanently deleted, except for data we're legally required to retain (e.g., billing records for 7 years)."
  }
];

export function FAQPage({ onNavigate }: FAQPageProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 mb-6 mx-auto hover:bg-white/50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">Find answers to common questions about MedExJob.com</p>
          <div className="w-24 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* FAQ Content */}
        <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200 overflow-hidden border border-gray-100">
          {faqData.map((faq, index) => (
            <div key={index} className="p-8 hover:bg-gray-50 transition-all duration-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-start gap-4 text-left group"
              >
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-xs">Q</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 group-hover:text-purple-700 transition-colors duration-200 leading-relaxed">{faq.question}</h3>
                </div>
                {openItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0 transition-transform duration-200 mt-1" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 group-hover:text-purple-600 transition-colors duration-200 mt-1" />
                )}
              </button>
              {openItems.has(index) && (
                <div className="mt-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-xs">A</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg flex-1">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
