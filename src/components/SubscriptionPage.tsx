import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Users, 
  BarChart3, 
  Shield, 
  Clock,
  ArrowLeft,
  Crown,
  Target,
  TrendingUp,
  Sparkles,
  Award,
  Rocket,
  CheckCircle2,
  X,
  ArrowRight,
  Building2,
  Briefcase
} from 'lucide-react';

interface SubscriptionPageProps {
  onNavigate: (path: string) => void;
}

export function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Rocket,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      features: [
        'Post up to 3 jobs',
        'Basic analytics',
        'Email support',
        'Standard job board visibility'
      ],
      limitations: [
        'Limited to 3 active jobs',
        'No advanced analytics',
        'No priority support'
      ],
      popular: false,
      current: true
    },
    {
      name: 'Professional',
      price: '₹2,999',
      period: 'month',
      description: 'Best for growing companies',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      features: [
        'Unlimited job postings',
        'Advanced analytics & insights',
        'Priority support',
        'Featured job listings',
        'Resume database access',
        'Custom branding'
      ],
      limitations: [],
      popular: true,
      current: false
    },
    {
      name: 'Enterprise',
      price: '₹4,999',
      period: 'month',
      description: 'For large organizations',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced screening tools',
        'Bulk hiring features',
        'API access',
        'White-label solutions'
      ],
      limitations: [],
      popular: false,
      current: false
    }
  ];

  const comparisonFeatures = [
    { name: 'Job Postings', basic: '3 jobs', professional: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Analytics', basic: 'Basic', professional: 'Advanced', enterprise: 'Advanced + Custom' },
    { name: 'Support', basic: 'Email', professional: 'Priority', enterprise: 'Dedicated Manager' },
    { name: 'Resume Database', basic: false, professional: true, enterprise: true },
    { name: 'Featured Listings', basic: false, professional: true, enterprise: true },
    { name: 'Custom Branding', basic: false, professional: true, enterprise: true },
    { name: 'API Access', basic: false, professional: false, enterprise: true },
    { name: 'Account Manager', basic: false, professional: false, enterprise: true },
  ];

  const faqs = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required. Cancel anytime during the trial period.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets through secure payment gateways.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No cancellation fees, and you\'ll retain access until the end of your billing period.'
    },
    {
      question: 'Do you offer annual billing discounts?',
      answer: 'Yes! Save up to ₹12,000 with our annual plans. Annual subscriptions include 2 months free.'
    },
    {
      question: 'What happens to my jobs if I downgrade?',
      answer: 'If you downgrade, excess jobs beyond your new plan limit will remain active until they expire naturally or you remove them manually.'
    }
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Basic') {
      onNavigate('employer-dashboard');
    } else {
      alert(`Redirecting to payment for ${planName} plan...`);
      // TODO: Implement actual payment integration
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('employer-dashboard')}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-8 w-px bg-blue-200" />
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
                  <p className="text-sm text-gray-600">Choose the perfect plan for your hiring needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Limited Time Offer - 2 Months Free on Annual Plans
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose the Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Scale your recruitment process with our flexible subscription plans. 
            From startups to enterprises, we have the right solution for you.
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Join <strong className="text-blue-600">2,000+</strong> companies already hiring with MedExJob.com
          </p>
        </div>

        {/* Enhanced Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative p-8 rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular 
                    ? `${plan.borderColor} border-4 scale-105 transform` 
                    : plan.current
                    ? 'border-green-400 border-2'
                    : 'border-gray-200'
                } ${plan.bgColor} overflow-hidden`}
              >
                {/* Decorative gradient background */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${plan.color}`} />
                
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Star className="w-4 h-4 fill-white" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Current Plan
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8 relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period !== 'forever' && (
                      <span className="text-gray-600 text-xl">/{plan.period}</span>
                    )}
                  </div>
                  {plan.period !== 'forever' && (
                    <div className="text-sm text-gray-500">
                      or ₹{plan.price === '₹2,999' ? '29,990' : '49,990'}/year (save 2 months)
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8 relative z-10">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    What's included:
                  </h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-bold text-gray-900 mb-4 mt-6 flex items-center gap-2">
                        <X className="w-5 h-5 text-gray-400" />
                        Limitations:
                      </h4>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-gray-500 leading-relaxed">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    plan.current
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : plan.popular
                      ? `bg-gradient-to-r ${plan.color} hover:shadow-2xl text-white`
                      : `${plan.buttonColor} text-white`
                  }`}
                >
                  {plan.current ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Current Plan
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Choose {plan.name}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Features Comparison */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-200 p-8 md:p-12 mb-16 overflow-hidden">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <BarChart3 className="w-4 h-4" />
              Compare Features
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              See All Features Side by Side
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make an informed decision by comparing all features across our plans
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-6 px-6 font-bold text-gray-900 text-lg">Features</th>
                  <th className="text-center py-6 px-6">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-lg">Basic</span>
                      <span className="text-sm text-gray-500 font-normal">Free</span>
                    </div>
                  </th>
                  <th className="text-center py-6 px-6">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-blue-600 text-lg">Professional</span>
                      <span className="text-sm text-gray-500 font-normal">₹2,999/mo</span>
                    </div>
                  </th>
                  <th className="text-center py-6 px-6">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-purple-600 text-lg">Enterprise</span>
                      <span className="text-sm text-gray-500 font-normal">₹4,999/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-5 px-6 font-semibold text-gray-900">{feature.name}</td>
                    <td className="text-center py-5 px-6">
                      {typeof feature.basic === 'boolean' ? (
                        feature.basic ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{feature.basic}</span>
                      )}
                    </td>
                    <td className="text-center py-5 px-6 bg-blue-50/30">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{feature.professional}</span>
                      )}
                    </td>
                    <td className="text-center py-5 px-6 bg-purple-50/30">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-200 p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Common Questions
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Got questions? We've got answers. Everything you need to know about our plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-blue-100 hover:border-blue-300">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  {faq.question}
                </h4>
                <p className="text-gray-600 leading-relaxed pl-10">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Trusted by leading healthcare organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-gray-500">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">2,000+ Employers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
