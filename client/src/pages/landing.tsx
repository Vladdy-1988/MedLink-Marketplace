import { useEffect, type MouseEvent } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { ClinicalHeroArt } from "@/components/ClinicalVisuals";
import { MedlinkLogo } from "@/components/MedlinkLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle,
  DollarSign,
  HeartPulse,
  Home,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CareCard = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const providerBenefits: CareCard[] = [
  {
    icon: CalendarCheck,
    title: "Your patients, your schedule",
    body: "Set your availability, service areas, and pricing. MedLink handles discovery - you handle care.",
  },
  {
    icon: DollarSign,
    title: "Get paid automatically",
    body: "Patients pay through MedLink. Your earnings are deposited directly after each completed visit.",
  },
  {
    icon: ShieldCheck,
    title: "Built for compliance",
    body: "HIA-compliant documentation, consent records, and PIPEDA-compliant patient notes built in.",
  },
];

const patientBenefits: CareCard[] = [
  {
    icon: UserRoundCheck,
    title: "Verified and trusted",
    body: "Every provider profile is reviewed for credentials, quality, and patient safety.",
  },
  {
    icon: HeartPulse,
    title: "Personalized for you",
    body: "Find nurses, physiotherapists, denturists, and more by service, location, and care need.",
  },
  {
    icon: LockKeyhole,
    title: "Secure and private",
    body: "Your care details are protected with privacy-first workflows built for Canadian healthcare.",
  },
];

const careSteps = [
  {
    icon: Search,
    number: "01",
    title: "Find",
    body: "Search for doctors, clinics, or home-care specialists near you.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Compare",
    body: "Compare profiles, fees, ratings, coverage, and availability.",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Book",
    body: "Choose your time and book the visit with confidence.",
  },
  {
    icon: UserRoundCheck,
    number: "04",
    title: "Manage",
    body: "Track appointments, records, reminders, and provider messages.",
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
  "Mobile Lab Tests",
  "Podiatry",
  "Speech Therapy",
  "Pharmacy",
];

const launchHighlights = [
  {
    icon: Home,
    title: "Calgary house-call focus",
    body: "The marketplace is built around in-home healthcare discovery and booking for Calgary patients.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-ready records",
    body: "Care notes, consent workflows, and PHI audit logging are part of the patient and provider experience.",
  },
  {
    icon: Users,
    title: "Provider-first scheduling",
    body: "Providers can define availability, service areas, pricing, and visit types from one dashboard.",
  },
];

const conciergeActions = [
  {
    icon: Stethoscope,
    title: "Find a specialist",
    body: "for knee pain",
    href: "/providers",
  },
  {
    icon: HeartPulse,
    title: "Compare",
    body: "heart doctors",
    href: "/providers",
  },
  {
    icon: MapPin,
    title: "Find a clinic",
    body: "near me",
    href: "/providers",
  },
  {
    icon: ShieldCheck,
    title: "Help with",
    body: "insurance",
    href: "/support",
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

  const scrollToProviders = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7fbff] text-slate-900 scroll-smooth">
      <Navigation />

      <main>
        <section className="relative px-6 pb-16 pt-20 lg:pb-24 lg:pt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_16%,rgba(20,184,166,0.16),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(96,165,250,0.2),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f4faff_100%)]" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                AI-powered care concierge
              </div>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Your journey to better health,
                <span className="block bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                  simplified.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Compare verified in-home healthcare providers, book with confidence, and manage care from one secure place.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/providers">
                  <Button
                    size="lg"
                    className="rounded-full bg-teal-500 px-7 text-white shadow-[0_14px_32px_rgba(20,184,166,0.28)] hover:bg-teal-600"
                  >
                    Find Care Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-sky-100 bg-white/80 px-7 text-slate-800 shadow-sm backdrop-blur hover:bg-white"
                  >
                    Join as Provider
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-3">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  Calgary-based
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  Verified providers
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  HIA + PIPEDA
                </span>
              </div>
            </div>

            <ClinicalHeroArt />
          </div>

          <div className="relative z-20 mx-auto mt-10 max-w-6xl">
            <div className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,76,117,0.12)] backdrop-blur-xl lg:grid-cols-[1.2fr_repeat(4,1fr)_auto]">
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50/70 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-blue-700">Hi, I'm MedLink AI.</div>
                  <div className="text-xs text-slate-500">How can I help you today?</div>
                </div>
              </div>

              {conciergeActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-sky-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{action.title}</span>
                      <span className="block text-xs text-slate-500">{action.body}</span>
                    </span>
                  </Link>
                );
              })}

              <Link href="/providers" className="flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/25 transition-colors hover:bg-teal-600">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-600">Care you can trust</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-blue-900 sm:text-4xl">
              Personalized. Private. Powerful.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {patientBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card key={benefit.title} className="border-0 bg-white/80 shadow-[0_18px_50px_rgba(15,76,117,0.08)] backdrop-blur">
                    <CardContent className="p-7 text-center">
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{benefit.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-blue-50/70 to-teal-50/70 p-8 shadow-[0_24px_70px_rgba(15,76,117,0.1)] lg:p-12">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-teal-600">How it works</p>
            <h2 className="mt-3 text-center text-3xl font-black tracking-tight text-blue-900 sm:text-4xl">
              Care in four simple steps
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-4">
              {careSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_16px_40px_rgba(37,99,235,0.12)]">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="mx-auto mt-5 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-xs font-black text-white">
                      {step.number}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="providers" className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-600">For healthcare providers</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                  Grow your practice without the overhead
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  MedLink gives house-call providers a polished profile, secure booking, and a simpler path to patients who need care at home.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {disciplines.map((discipline) => (
                    <span
                      key={discipline}
                      className="rounded-full border border-teal-100 bg-white/75 px-3 py-1 text-sm font-semibold text-teal-700 shadow-sm"
                    >
                      {discipline}
                    </span>
                  ))}
                </div>
                <Link href="/apply">
                  <Button className="mt-8 rounded-full bg-blue-600 px-7 text-white hover:bg-blue-700">
                    Apply to Join MedLink
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-3 text-sm text-slate-500">Verification takes 2-3 business days.</p>
              </div>

              <div className="grid gap-5">
                {providerBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={benefit.title} className="border-0 bg-white/90 shadow-[0_18px_50px_rgba(15,76,117,0.08)] backdrop-blur">
                      <CardContent className="flex gap-5 p-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{benefit.title}</h3>
                          <p className="mt-2 leading-7 text-slate-600">{benefit.body}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_70px_rgba(15,76,117,0.11)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-600">Better care, better outcomes</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-blue-950">
                Better health. More peace of mind. Every step of the way.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Healthcare should feel simple, calm, and secure. MedLink keeps discovery, booking, and follow-up in one place.
              </p>
              <Link href="/providers">
                <Button className="mt-8 w-fit rounded-full bg-teal-500 px-7 text-white hover:bg-teal-600">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative min-h-[360px] overflow-hidden bg-sky-50">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=90"
                alt="Bright, calm home living room prepared for in-home care"
                className="h-full min-h-[360px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-teal-600">Launch-ready care model</p>
            <h2 className="mt-3 text-center text-3xl font-black tracking-tight text-blue-900 sm:text-4xl">
              Built for Calgary care teams
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {launchHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <Card key={highlight.title} className="border-0 bg-white/90 shadow-[0_18px_50px_rgba(15,76,117,0.08)] backdrop-blur">
                    <CardContent className="p-7">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{highlight.title}</h3>
                      <p className="mt-3 leading-7 text-slate-600">{highlight.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-br from-blue-700 to-teal-600 p-8 text-center text-white shadow-[0_24px_70px_rgba(37,99,235,0.2)] lg:p-12">
            <h2 className="text-4xl font-black tracking-tight">Ready to expand your practice?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-blue-50">
              Join MedLink and start seeing patients in their homes across Calgary.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/apply">
                <Button size="lg" className="rounded-full bg-white px-7 font-semibold text-blue-700 hover:bg-blue-50">
                  Apply as a Provider
                </Button>
              </Link>
              <Link href="/providers">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/50 bg-white/10 px-7 text-white hover:bg-white/20"
                >
                  Find a Provider
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100/80 bg-white/90 px-6 py-12 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <MedlinkLogo size="md" />
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                AI-powered care concierge that helps you find the right care, at the right time, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-medium text-slate-600 sm:grid-cols-3">
              <Link href="/providers" className="hover:text-blue-700">Find Care</Link>
              <Link href="/apply" className="hover:text-blue-700">Join Our Network</Link>
              <a href="/#providers" onClick={scrollToProviders} className="hover:text-blue-700">
                How It Works
              </a>
              <Link href="/support" className="hover:text-blue-700">Help Center</Link>
              <Link href="/about" className="hover:text-blue-700">About Us</Link>
              <Link href="/safety" className="hover:text-blue-700">Security</Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-blue-100 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <span>Copyright {currentYear} MedLink. All rights reserved.</span>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
              <LockKeyhole className="h-3.5 w-3.5" />
              HIA + PIPEDA compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
