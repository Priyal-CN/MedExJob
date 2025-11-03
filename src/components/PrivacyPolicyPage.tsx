import React, { useState, useRef } from 'react';
import { ArrowLeft, Search, Printer, Download, Shield, Eye, Lock, Users, Globe, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: Shield },
    { id: 'consent-management', title: 'Consent & Consent Management', icon: Shield },
    { id: 'legal-bases', title: 'Legal Bases for Processing', icon: Lock },
    { id: 'information-collection', title: 'Information We Collect', icon: Eye },
    { id: 'how-we-use', title: 'How We Use Your Information', icon: Users },
    { id: 'information-sharing', title: 'Information Sharing', icon: Globe },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'your-rights', title: 'Your Rights', icon: Shield },
    { id: 'data-retention', title: 'Data Retention', icon: Lock },
    { id: 'cookies', title: 'Cookies and Tracking', icon: Eye },
    { id: 'international-transfers', title: 'International Data Transfers', icon: Globe },
    { id: 'policy-changes', title: 'Changes to This Policy', icon: Shield },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([document.documentElement.innerHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'medexjob-privacy-policy.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-200">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 hover:bg-blue-50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                  Privacy Policy
                </h1>
                <p className="text-gray-600">Last updated: January 2025</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search privacy policy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3" ref={contentRef}>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-12 border border-gray-100">
              <section id="introduction" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Introduction</h2>
                    <p className="text-gray-600">Your privacy matters to us</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    At <strong>MedExJob.com</strong>, we are committed to protecting your privacy and ensuring the security of your personal information.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    We believe in transparency and want you to understand exactly how your data is handled.
                  </p>
                </div>
              </section>

              <section id="information-collection" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Information We Collect</h2>
                    <p className="text-gray-600">What data we gather and why</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-xl text-green-800 mb-4 font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Name, email address, phone number</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Professional qualifications and experience</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Resume and work history</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Account credentials (encrypted)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-xl text-blue-800 mb-4 font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Usage Information
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">IP address and location data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Browser type and version</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Pages visited and time spent</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Job search preferences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="how-we-use" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">How We Use Your Information</h2>
                    <p className="text-gray-600">How your data helps us serve you better</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">Service Delivery</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Provide job portal services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Match candidates with jobs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Process applications</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Communication</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Account updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Job notifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Platform updates</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Improvement</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Platform enhancement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Security measures</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Legal compliance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Additional sections with enhanced design */}
              <section id="information-sharing" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Information Sharing</h2>
                    <p className="text-gray-600">How we protect your data</p>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    We do <strong>not sell, rent, or trade</strong> your personal information. Data sharing is strictly limited to service providers under strict contractual limits:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-5 border border-orange-200">
                      <h3 className="text-lg font-semibold text-orange-800 mb-3">Service Providers</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm"><strong>Payment Processors:</strong> Razorpay/Stripe (payment processing only)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm"><strong>Cloud Services:</strong> AWS/GCP (data hosting with encryption)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm"><strong>Email Services:</strong> Mailchimp (transactional emails only)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-orange-200">
                      <h3 className="text-lg font-semibold text-orange-800 mb-3">Other Sharing</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">With employers when you apply for jobs (application data only)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">When required by law or legal process</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">All third parties are bound by strict data protection agreements</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-300">
                    <p className="text-orange-800 font-semibold text-sm">
                      ✓ We never sell or rent your data to third parties for marketing or advertising purposes.
                    </p>
                  </div>
                </div>
              </section>

              <section id="data-security" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Data Security</h2>
                    <p className="text-gray-600">Your data is protected with industry-standard security</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    We implement <strong>enterprise-grade security measures</strong> including encryption, secure servers, 
                    regular security assessments, and access controls to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </section>

              <section id="consent-management" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Consent & Consent Management</h2>
                    <p className="text-gray-600">Transparent and versioned consent tracking</p>
                  </div>
                </div>
                <div className="bg-teal-50 rounded-xl p-6 border-l-4 border-teal-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    We implement a <strong>comprehensive consent management system</strong> that ensures transparency and compliance with data protection regulations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-5 border border-teal-200">
                      <h3 className="text-lg font-semibold text-teal-800 mb-3">Mandatory Consent</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">All new users must provide explicit consent through mandatory checkboxes</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Consents are versioned and timestamped for audit purposes</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">You can view and manage your consent preferences in your dashboard</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-teal-200">
                      <h3 className="text-lg font-semibold text-teal-800 mb-3">Consent Withdrawal</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">You can withdraw your consent at any time</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Withdrawal does not affect the lawfulness of processing based on consent before withdrawal</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">Full consent history is maintained for legal compliance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section id="legal-bases" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Legal Bases for Processing</h2>
                    <p className="text-gray-600">Why we process your data</p>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    We process your personal data based on the following <strong>legal bases</strong> as defined by data protection regulations:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-5 border border-amber-200">
                      <h3 className="text-lg font-semibold text-amber-800 mb-3">Consent</h3>
                      <p className="text-gray-700 text-sm">When you have given clear consent for us to process your personal data for specific purposes (e.g., marketing communications).</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-amber-200">
                      <h3 className="text-lg font-semibold text-amber-800 mb-3">Contractual Necessity</h3>
                      <p className="text-gray-700 text-sm">Processing necessary to perform a contract with you or take steps at your request before entering into a contract (e.g., job matching services).</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-amber-200">
                      <h3 className="text-lg font-semibold text-amber-800 mb-3">Legal Obligation</h3>
                      <p className="text-gray-700 text-sm">Processing necessary for compliance with a legal obligation (e.g., tax reporting, law enforcement cooperation, KYC verification records).</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-amber-200">
                      <h3 className="text-lg font-semibold text-amber-800 mb-3">Legitimate Interest</h3>
                      <p className="text-gray-700 text-sm">Processing necessary for our legitimate interests, such as fraud prevention, network security, and platform improvement, balanced against your rights.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="your-rights" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Your Rights</h2>
                    <p className="text-gray-600">You have comprehensive control over your data</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4">Data Access & Control</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">Right of Access:</strong>
                          <span className="text-gray-700 text-sm block mt-1">Request access to your personal data through dashboard tools</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">Right of Rectification:</strong>
                          <span className="text-gray-700 text-sm block mt-1">Correct inaccurate or incomplete data via your profile settings</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">Right to Erasure ("Right to be Forgotten"):</strong>
                          <span className="text-gray-700 text-sm block mt-1">Request deletion of your personal data, subject to legal obligations</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Privacy & Portability</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">Right to Data Portability:</strong>
                          <span className="text-gray-700 text-sm block mt-1">Receive your data in a structured, machine-readable format</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">Right to Object:</strong>
                          <span className="text-gray-700 text-sm block mt-1">Object to processing of your personal data for legitimate interests or direct marketing</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <strong className="text-gray-900">Dashboard Tools:</strong>
                          <span className="text-gray-700 text-sm block mt-1">All rights can be exercised through user-friendly dashboard tools</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="data-retention" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Data Retention</h2>
                    <p className="text-gray-600">How long we keep your data</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-slate-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-5 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Active Users</h3>
                      <p className="text-gray-700 text-sm mb-2">Data is retained while your account remains active and you continue to use our services.</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Inactive Accounts</h3>
                      <p className="text-gray-700 text-sm mb-2">Personal data is anonymized after <strong>24 months</strong> of account inactivity.</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Deleted Accounts</h3>
                      <p className="text-gray-700 text-sm mb-2">Soft delete for <strong>30 days</strong> (reversible), then permanent hard delete after additional <strong>30 days</strong>.</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">HR & Billing Data</h3>
                      <p className="text-gray-700 text-sm mb-2">Retained for <strong>7 years</strong> for tax, accounting, and legal compliance purposes.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="cookies" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Cookies and Tracking</h2>
                    <p className="text-gray-600">Our cookie policy and tracking practices</p>
                  </div>
                </div>
                <div className="bg-pink-50 rounded-xl p-6 border-l-4 border-pink-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    We use cookies and similar tracking technologies to enhance your experience on our platform. <strong>Tracking is disabled by default</strong>, and you have full control over your preferences.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-5 border border-pink-200">
                      <h3 className="text-lg font-semibold text-pink-800 mb-3">Essential Cookies</h3>
                      <p className="text-gray-700 text-sm">Required for basic site functionality, authentication, and security. These cannot be disabled.</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-pink-200">
                      <h3 className="text-lg font-semibold text-pink-800 mb-3">Functional Cookies</h3>
                      <p className="text-gray-700 text-sm">Enable enhanced functionality and personalization, such as remembering your preferences.</p>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-pink-200">
                      <h3 className="text-lg font-semibold text-pink-800 mb-3">Analytics Cookies</h3>
                      <p className="text-gray-700 text-sm">Help us understand how visitors interact with our website. These are <strong>disabled by default</strong> and require your explicit consent.</p>
                    </div>
                  </div>
                  <div className="mt-6 bg-white rounded-lg p-5 border border-pink-200">
                    <p className="text-gray-700 text-sm">
                      You can manage your cookie preferences at any time through your account settings or browser settings. Most browsers allow you to refuse or delete cookies, though this may affect website functionality.
                    </p>
                  </div>
                </div>
              </section>

              <section id="international-transfers" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">International Data Transfers</h2>
                    <p className="text-gray-600">Cross-border data handling</p>
                  </div>
                </div>
                <div className="bg-cyan-50 rounded-xl p-6 border-l-4 border-cyan-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    Your personal data may be transferred to and processed in countries outside your country of residence. We ensure all international data transfers comply with applicable data protection laws:
                  </p>
                  <div className="bg-white rounded-lg p-5 border border-cyan-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Lawful Basis:</strong> All transfers have a lawful basis and are protected by appropriate safeguards</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Standard Contractual Clauses:</strong> We use standard contractual clauses approved by data protection authorities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Cloud Infrastructure:</strong> Data may be stored on cloud servers located in different regions for redundancy and performance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Law Enforcement Cooperation:</strong> We cooperate with lawful requests from law enforcement agencies in compliance with applicable laws</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="policy-changes" className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-gray-900 font-bold">Changes to This Policy</h2>
                    <p className="text-gray-600">We keep you informed of updates</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed text-lg mb-6">
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes:
                  </p>
                  <div className="bg-white rounded-lg p-5 border border-blue-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Email Notification:</strong> We will send an email to the address associated with your account</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Platform Notice:</strong> A prominent notice will be displayed on our platform</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Version History:</strong> Previous versions of this policy are archived and accessible upon request</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm"><strong>Effective Date:</strong> The "Last updated" date at the top of this policy indicates when changes take effect</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 text-sm mt-4">
                    We encourage you to review this Privacy Policy periodically. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={handleBackToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-50"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
