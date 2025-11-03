import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface TermsConditionsPageProps {
  onNavigate: (page: string) => void;
}

export function TermsConditionsPage({ onNavigate }: TermsConditionsPageProps) {
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
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">Last updated: January 2025</p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-12 border border-gray-100">
          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Acceptance of Terms</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed text-lg">
                By accessing and using MedExJob.com, you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Use License</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Permission is granted to temporarily access the materials (information or software) on MedExJob.com
                for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">Modify or copy the materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">Use the materials for any commercial purpose or for any public display</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">Attempt to decompile or reverse engineer any software contained on MedExJob.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">Remove any copyright or other proprietary notations from the materials</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">User Accounts</h2>
            </div>
            <div className="pl-11 space-y-6">
              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">Registration</h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  To access certain features of our platform, you must register for an account. You agree to:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Provide accurate and complete information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Maintain the security of your password</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Accept responsibility for all activities under your account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Notify us immediately of any unauthorized use</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">Account Types</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Candidates:</strong> Medical professionals seeking employment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Employers:</strong> Healthcare organizations posting job opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Administrators:</strong> Platform management and oversight</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">4</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Job Posting and Applications</h2>
            </div>
            <div className="pl-11 space-y-6">
              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">For Employers</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Job postings must be accurate, non-discriminatory, and comply with medical advertising laws</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">You are responsible for verifying candidate qualifications and conducting your own background checks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">All paid features and job postings must comply with medical advertising regulations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Violation of posting guidelines may result in account suspension or termination</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">For Candidates</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Applications must contain truthful and accurate information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">You are responsible for the accuracy of your resume, qualifications, and certifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Multiple applications to the same position may be restricted to prevent spam</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Professional conduct is expected in all communications with employers</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">4.5</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Refund, Billing, and Disputes</h2>
            </div>
            <div className="pl-11 space-y-6">
              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">Refund Policy</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Subscription Fees:</strong> Subscription fees are generally non-refundable, except as required by applicable consumer protection laws</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Service Issues:</strong> If you experience technical issues preventing service use, contact support within 7 days for a refund consideration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Billing Disputes:</strong> All billing disputes must be raised within 30 days of the charge date</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">Payment Processing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Payments are processed securely through Razorpay/Stripe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">All transactions are subject to our payment processor's terms and conditions</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">5</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">User Conduct and Content Guidelines</h2>
            </div>
            <div className="pl-11 space-y-6">
              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">Prohibited Content and Activities</h3>
                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  All content posted on MedExJob.com must comply with our community standards and legal requirements:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Fraudulent Posts:</strong> Strictly prohibited. This includes fake job listings, scam postings, or attempts to defraud job seekers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Explicit or Inappropriate Content:</strong> No explicit, offensive, or discriminatory content is allowed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Solicitation of Payments:</strong> Employers are strictly prohibited from soliciting payments from job seekers. No job should require payment from candidates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Discriminatory Practices:</strong> No discriminatory language or practices based on race, gender, religion, age, disability, or other protected characteristics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>False Information:</strong> No false or misleading information in job postings or applications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Copyright Violations:</strong> No copyrighted material without proper permission or authorization</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl text-green-700 mb-4 font-medium">Ethical and Compliance Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">All paid features and job postings must comply with medical advertising laws and regulations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed">Content is subject to review by our moderation team and DPO (Data Protection Officer) oversight</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">5.5</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Appeal and Suspension Process</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                We have a fair and transparent process for handling account suspensions and appeals:
              </p>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Service Level Agreement (SLA)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>24-Hour Acknowledgment:</strong> All appeals and disputes will be acknowledged within 24 hours of submission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>72-Hour Resolution:</strong> We aim to resolve all appeals and disputes within 72 hours of acknowledgment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed"><strong>Transparent Process:</strong> You will be informed of the reason for suspension and the steps required for reinstatement</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Appeal Submission</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-sm">Submit appeals through your dashboard or email to medexjob1997@gmail.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-sm">Include all relevant information and evidence to support your appeal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 leading-relaxed text-sm">Our team will review your case and provide a detailed response within the SLA timeframe</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">6</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Privacy, Data Protection, and Legal Transparency</h2>
            </div>
            <div className="pl-11 space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of MedExJob.com,
                  to understand our practices regarding the collection and use of your personal information.
                </p>
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">KYC Evidence and Legal Compliance</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed"><strong>KYC Verification:</strong> We retain KYC evidence and verification records as required by law and for fraud prevention</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed"><strong>Law Enforcement Cooperation:</strong> We cooperate with lawful requests from law enforcement agencies in compliance with applicable laws</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed"><strong>Data Transfer Transparency:</strong> All data transfers have a lawful basis and are documented for transparency</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed"><strong>DPO Oversight:</strong> Our Data Protection Officer oversees compliance with data protection regulations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">7</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Intellectual Property</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed text-lg">
                The service and its original content, features, and functionality are and will remain the exclusive property
                of MedExJob.com and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">8</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Termination</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed text-lg">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability,
                under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">9</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Limitation of Liability</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed text-lg">
                In no event shall MedExJob.com, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
                loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">10</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Governing Law</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed text-lg">
                These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions.
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">11</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Changes to Terms</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed text-lg">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">12</span>
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">Contact Information</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">Email: medexjob1997@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">Phone: +91 9588015208</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">Address: 123, Medical Plaza, New Delhi, India</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
