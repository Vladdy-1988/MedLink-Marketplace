import { Link } from "wouter";
import { Mail, Phone, ShieldAlert } from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-blue-100/80 bg-gradient-to-b from-white to-sky-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="col-span-1 md:col-span-2">
            <MedlinkLogo size="md" />
            <p className="mt-5 max-w-md leading-7 text-slate-500">
              Professional in-home healthcare services across Calgary. Licensed providers, secure booking, and trusted care at your doorstep.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Phone:</span>
                <span className="ml-2">1-844-MEDLINK</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Email:</span>
                <span className="ml-2">support@mymedlink.ca</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Service Area:</span>
                <span className="ml-2">Calgary, Alberta</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Hours:</span>
                <span className="ml-2">7 AM - 11 PM Daily</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:support@mymedlink.ca"
                className="inline-flex items-center rounded-full border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email support
              </a>
              <a
                href="tel:1-844-633-5465"
                className="inline-flex items-center rounded-full border border-teal-100 bg-white px-3 py-2 text-sm font-semibold text-teal-700 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call MedLink
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-base font-bold text-slate-900">For Patients</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="/providers" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Find Providers</Link></li>
              <li><Link href="/rapid-services" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Rapid Services</Link></li>
              <li><Link href="/services" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>All Services</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>How It Works</Link></li>
              <li><Link href="/support" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Insurance Coverage</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-base font-bold text-slate-900">For Providers</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="/apply" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Join MedLink</Link></li>
              <li><a href="/api/login" className="hover:text-blue-700 transition-colors">Provider Portal</a></li>
              <li><Link href="/safety" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Verification Process</Link></li>
              <li><Link href="/support" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Provider Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-base font-bold text-slate-900">Company</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="/about" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>About MedLink</Link></li>
              <li><Link href="/safety" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Safety & Trust</Link></li>
              <li><Link href="/support" className="hover:text-blue-700 transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Support Center</Link></li>
              <li><a href="mailto:support@mymedlink.ca" className="hover:text-blue-700 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-blue-100 pt-8">
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>For life-threatening emergencies, always call 911 first. MedLink provides non-emergency healthcare services only.</span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-slate-500">
              Copyright {currentYear} MedLink House Calls Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/support" className="text-sm text-slate-500 transition-colors hover:text-blue-700">Privacy requests</Link>
              <Link href="/support" className="text-sm text-slate-500 transition-colors hover:text-blue-700">Terms questions</Link>
              <Link href="/safety" className="text-sm text-slate-500 transition-colors hover:text-blue-700">HIA + PIPEDA</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
