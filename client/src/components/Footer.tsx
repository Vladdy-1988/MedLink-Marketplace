import { Link } from "wouter";
import { Mail, Phone } from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <MedlinkLogo size="md" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Professional in-home healthcare services across Calgary. Licensed providers, secure booking, and trusted care at your doorstep.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <span className="text-sm font-medium">Phone:</span>
                <span className="ml-2 text-sm">1-844-MEDLINK</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-sm font-medium">Email:</span>
                <span className="ml-2 text-sm">support@mymedlink.ca</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-sm font-medium">Service Area:</span>
                <span className="ml-2 text-sm">Calgary, Alberta</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-sm font-medium">Hours:</span>
                <span className="ml-2 text-sm">7 AM - 11 PM Daily</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:support@mymedlink.ca"
                className="inline-flex items-center rounded-full border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-white hover:text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email support
              </a>
              <a
                href="tel:1-844-633-5465"
                className="inline-flex items-center rounded-full border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-white hover:text-white"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call MedLink
              </a>
            </div>
          </div>
          
          {/* Patient Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Patients</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/providers" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Find Providers</Link></li>
              <li><Link href="/rapid-services" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Rapid Services</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>All Services</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>How It Works</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Insurance Coverage</Link></li>
            </ul>
          </div>
          
          {/* Provider Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Providers</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/apply" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Join MedLink</Link></li>
              <li><a href="/api/login" className="hover:text-white transition-colors">Provider Portal</a></li>
              <li><Link href="/safety" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Verification Process</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Provider Support</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>About MedLink</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Safety & Trust</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Support Center</Link></li>
              <li><a href="mailto:support@mymedlink.ca" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        {/* Important Notice */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-8">
            <p className="text-red-200 text-sm font-medium text-center">
              <strong>Important:</strong> For life-threatening emergencies, always call 911 first. 
              MedLink provides non-emergency healthcare services only.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} MedLink House Calls Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy requests</Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Terms questions</Link>
              <Link href="/safety" className="text-gray-400 hover:text-white transition-colors text-sm">HIA + PIPEDA</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
