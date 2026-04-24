import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Shield,
  Star,
  Users,
} from "lucide-react";

const providerBenefits = [
  {
    icon: Calendar,
    title: "Your patients, your schedule",
    body: "Set your availability, service areas, and pricing. MedLink handles discovery - you handle care.",
  },
  {
    icon: DollarSign,
    title: "Get paid automatically",
    body: "Patients pay through MedLink. Your earnings are deposited directly after each completed visit.",
  },
  {
    icon: Shield,
    title: "Built for compliance",
    body: "HIA-compliant documentation, consent records, and PIPEDA-compliant patient notes built in.",
  },
];

const patientBenefits = [
  {
    icon: Users,
    title: "All disciplines, one platform",
    body: "Find nurses, physiotherapists, denturists, and more - all verified and available for home visits in Calgary.",
  },
  {
    icon: CheckCircle,
    title: "Insurance-friendly",
    body: "Providers on MedLink work with major Canadian insurers. Know your coverage before you book.",
  },
  {
    icon: Shield,
    title: "Safe and compliant",
    body: "Every provider is verified. Every visit is documented. Your health information stays private.",
  },
];

const steps = [
  {
    number: "01",
    title: "Apply & get verified",
    body: "Submit your credentials. Our team verifies and approves your profile within 2-3 business days.",
  },
  {
    number: "02",
    title: "Set up your profile",
    body: "Add your services, pricing, availability, and service areas across Calgary.",
  },
  {
    number: "03",
    title: "Patients find you",
    body: "Patients search by discipline, location, and insurance. Your profile ranks by rating and availability.",
  },
  {
    number: "04",
    title: "Visit, document, get paid",
    body: "Complete the visit, document in MedLink, and receive your payout automatically.",
  },
];

const disciplines = [
  "General Practice",
  "Nursing Services",
  "Physiotherapy",
  "Occupational Therapy",
  "Palliative Care",
  "Dental Care",
  "Mental Health",
  "Nutrition",
  "and more",
];

const launchHighlights = [
  {
    title: "Provider-first scheduling",
    body: "Providers can define availability, service areas, pricing, and visit types from one dashboard.",
  },
  {
    title: "Compliance-ready records",
    body: "Care notes, consent workflows, and PHI audit logging are built into the patient and provider experience.",
  },
  {
    title: "Calgary launch focus",
    body: "The marketplace is scoped around in-home healthcare discovery and booking for Calgary patients.",
  },
];

export default function Landing() {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    document.title = "MedLink - In-Home Healthcare in Calgary";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      (meta as HTMLMetaElement).name = "description";
      document.head.appendChild(meta);
    }
    (meta as HTMLMetaElement).content =
      "MedLink connects Calgary patients with verified in-home healthcare providers. Book nurses, physiotherapists, denturists and more.";
  }, []);

  const scrollToProviders = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Navigation />

      <section className="bg-gradient-to-b from-blue-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 text-center mb-6">
            Your practice.
            <span className="block">Delivered.</span>
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-10">
            MedLink connects Calgary patients with verified in-home healthcare providers - on your schedule, on your terms.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              >
                Apply as a Provider
              </Button>
            </Link>
            <Link href="/providers">
              <Button size="lg" variant="outline">
                Find a Provider
              </Button>
            </Link>
          </div>
          <div className="flex gap-8 justify-center mt-12 flex-wrap text-sm text-gray-500">
            <div>
              <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
              4 disciplines available
            </div>
            <div>
              <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
              Calgary-based
            </div>
            <div>
              <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
              HIA + PIPEDA compliant
            </div>
          </div>
        </div>
      </section>

      <section id="providers" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            For Healthcare Providers
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">
            Grow your practice without the overhead
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providerBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardContent className="p-6">
                    <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-10 mb-10">
            {disciplines.map((discipline) => (
              <span
                key={discipline}
                className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200"
              >
                {discipline}
              </span>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              >
                Apply to Join MedLink
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-3">Verification takes 2-3 business days.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="text-4xl font-black text-blue-200">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            For Patients
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">
            Healthcare that comes to you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patientBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardContent className="p-6">
                    <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-8">
            <Link href="/providers">
              <Button size="lg" variant="outline">
                Find a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Built for Calgary care teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {launchHighlights.map((highlight, index) => (
              <Card key={index} className="bg-white border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star key={starIndex} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-gray-700">{highlight.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(207,90%,54%)] py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to expand your practice?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join MedLink and start seeing patients in their homes across Calgary.
          </p>
          <Link href="/apply">
            <Button
              size="lg"
              className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 font-semibold"
            >
              Apply as a Provider
            </Button>
          </Link>
          <div className="mt-4">
            <Link href="/providers">
              <span className="text-white underline text-sm cursor-pointer">or find a provider -&gt;</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <div className="font-bold text-xl">MedLink</div>
              <p className="text-gray-400 text-sm mt-1">In-home healthcare, reimagined.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/providers">Find Providers</Link>
              <Link href="/apply">Apply as Provider</Link>
              <a href="/#providers" onClick={scrollToProviders} className="hover:text-white">
                How It Works
              </a>
              <Link href="/providers">Services</Link>
              <Link href="/support" className="hover:text-white">
                Support
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span>© {currentYear} MedLink. All rights reserved.</span>
              <Link href="/support" className="hover:text-white">Privacy requests</Link>
              <Link href="/support" className="hover:text-white">Terms questions</Link>
            </div>
            <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-green-400">
              🔒 HIA + PIPEDA Compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
