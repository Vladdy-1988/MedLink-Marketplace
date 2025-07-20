import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  CreditCard,
  UserCheck,
  Shield
} from "lucide-react";

const faqItems = [
  {
    question: "How do I book an appointment?",
    answer: "Browse our verified providers, select your service, choose an available time slot, and complete the booking form. You'll receive confirmation via email and SMS."
  },
  {
    question: "Are your healthcare providers licensed?",
    answer: "Yes, all providers undergo rigorous verification including license checks, background screening, insurance validation, and professional reference verification."
  },
  {
    question: "What services are covered by insurance?",
    answer: "Many services are covered by Alberta Health Services and extended health plans. We provide insurance information for each service and can help with documentation."
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes, you can cancel or reschedule up to 24 hours before your appointment through your patient dashboard or by contacting support."
  },
  {
    question: "What should I expect during a home visit?",
    answer: "Your provider will arrive on time, verify their identity, follow all safety protocols, provide professional care, and complete detailed documentation of the visit."
  },
  {
    question: "How do I pay for services?",
    answer: "We accept major credit cards, debit cards, and direct insurance billing where applicable. Payment is processed securely through our platform."
  }
];

const supportCategories = [
  {
    icon: Calendar,
    title: "Booking Support",
    description: "Help with scheduling, rescheduling, or canceling appointments",
    color: "blue"
  },
  {
    icon: CreditCard,
    title: "Billing & Insurance",
    description: "Questions about payments, insurance claims, and billing",
    color: "green"
  },
  {
    icon: UserCheck,
    title: "Provider Issues",
    description: "Concerns about your healthcare provider or service quality",
    color: "purple"
  },
  {
    icon: Shield,
    title: "Safety & Security",
    description: "Report safety concerns or security issues",
    color: "red"
  }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <HelpCircle className="w-16 h-16 text-blue-100 mr-4" />
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Support Center
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're here to help! Find answers to common questions, get support for your account, 
              or contact our team directly for personalized assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Need Immediate Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the fastest way to get support based on your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency During Visit</h3>
              <p className="text-gray-600 mb-6">
                For urgent issues during your appointment
              </p>
              <Button className="bg-red-600 hover:bg-red-700 w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call 1-844-MEDLINK
              </Button>
              <Badge className="mt-2 bg-red-100 text-red-800">Available 24/7</Badge>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-6">
                Get instant help with booking and general questions
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Response in &lt; 2 min</Badge>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email Support</h3>
              <p className="text-gray-600 mb-6">
                For detailed questions and non-urgent matters
              </p>
              <Button className="bg-green-600 hover:bg-green-700 w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Badge className="mt-2 bg-green-100 text-green-800">Response in &lt; 4 hours</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Can We Help You With?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the category that best matches your question or concern.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportCategories.map((category, index) => {
              const IconComponent = category.icon;
              const colorClasses = {
                blue: "bg-blue-500",
                green: "bg-green-500",
                purple: "bg-purple-500",
                red: "bg-red-500"
              };
              
              return (
                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className={`w-12 h-12 ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to the most common questions about our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">
              Can't find what you're looking for? Send us a detailed message and we'll get back to you.
            </p>
          </div>
          
          <Card className="p-8 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    First Name *
                  </label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Last Name *
                  </label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Email Address *
                  </label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Phone Number
                  </label>
                  <Input placeholder="Enter your phone number" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Subject *
                </label>
                <Input placeholder="Brief description of your inquiry" />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Message *
                </label>
                <Textarea 
                  placeholder="Please provide as much detail as possible about your question or concern..."
                  rows={6}
                />
              </div>
              
              <Button className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white font-semibold py-3 rounded-xl">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Support Hours</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our support team is here to help during these hours. Emergency line available 24/7.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">General Support</h3>
              <div className="text-gray-300">
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday - Sunday: 9:00 AM - 6:00 PM</p>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
              <div className="text-gray-300">
                <p>Monday - Friday: 7:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 8:00 AM - 8:00 PM</p>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Emergency Line</h3>
              <div className="text-gray-300">
                <p>Available 24/7</p>
                <p>For urgent issues during appointments</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}