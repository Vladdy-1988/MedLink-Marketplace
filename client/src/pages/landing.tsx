import { useEffect, type MouseEvent } from "react";
import { Link } from "wouter";
import { MedlinkLogo } from "@/components/MedlinkLogo";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarCheck,
  ChevronDown,
  Globe2,
  HeartPulse,
  Headphones,
  LockKeyhole,
  MapPin,
  PlayCircle,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CareCard = {
  icon: LucideIcon;
  title: string;
  body: string;
};

type StatCard = {
  icon: LucideIcon;
  value: string;
  label: string;
};

const patientBenefits: CareCard[] = [
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    body: "All providers are reviewed for quality, credentials, and patient safety.",
  },
  {
    icon: HeartPulse,
    title: "Personalized for You",
    body: "Our AI understands your needs and recommends options tailored to you.",
  },
  {
    icon: LockKeyhole,
    title: "Secure & Private",
    body: "Your data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: Headphones,
    title: "AI Concierge Support",
    body: "Real-time support and smart guidance whenever you need it.",
  },
];

const careSteps = [
  {
    icon: Search,
    number: "1",
    title: "Find",
    body: "Search for doctors, clinics, or specialists near you.",
  },
  {
    icon: Scale,
    number: "2",
    title: "Compare",
    body: "Compare profiles, ratings, fees, and availability.",
  },
  {
    icon: CalendarCheck,
    number: "3",
    title: "Book",
    body: "Choose your time and book with ease.",
  },
  {
    icon: UserRoundCheck,
    number: "4",
    title: "Manage",
    body: "Manage appointments, records, and reminders in one place.",
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

const careStats: StatCard[] = [
  {
    icon: MapPin,
    value: "Calgary",
    label: "House-call focus",
  },
  {
    icon: UserRoundCheck,
    value: "Verified",
    label: "Provider review",
  },
  {
    icon: Building2,
    value: "In-home",
    label: "Care network",
  },
  {
    icon: ShieldCheck,
    value: "Private",
    label: "Secure booking",
  },
];

function LandingHeader({ onHowItWorks }: { onHowItWorks: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <header className="relative z-50 px-5 pt-6 sm:px-6">
      <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between">
        <Link href="/" className="flex items-center">
          <MedlinkLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-bold text-slate-700 lg:flex">
          <Link href="/" className="relative text-blue-900">
            Home
            <span className="absolute -bottom-3 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-teal-500" />
          </Link>
          <Link href="/providers" className="transition-colors hover:text-blue-800">
            Find Care
          </Link>
          <a href="#how-it-works" onClick={onHowItWorks} className="transition-colors hover:text-blue-800">
            How It Works
          </a>
          <Link href="/apply" className="transition-colors hover:text-blue-800">
            For Providers
          </Link>
          <Link href="/about" className="transition-colors hover:text-blue-800">
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-sky-50 sm:inline-flex"
            aria-label="Language selector"
          >
            <Globe2 className="h-3.5 w-3.5" />
            English
            <ChevronDown className="h-3 w-3" />
          </button>
          <Button
            onClick={handleLogin}
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-blue-100 bg-white px-4 text-xs font-bold text-blue-800 shadow-sm hover:bg-sky-50"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}

function ReferenceHeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[calc(100vw-2.5rem)] overflow-visible sm:max-w-[680px]" aria-hidden="true">
      <img
        src="/assets/medlink-journey-hero.png"
        alt=""
        className="block w-full select-none rounded-[1.5rem]"
        draggable={false}
      />
    </div>
  );
}

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

  const scrollToHowItWorks = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7fbff] text-slate-900 scroll-smooth">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_16%_8%,rgba(45,212,191,0.14),transparent_28%),radial-gradient(circle_at_88%_4%,rgba(147,197,253,0.2),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7fbff_58%,#ffffff_100%)]" />

      <LandingHeader onHowItWorks={scrollToHowItWorks} />

      <main>
        <section className="relative px-5 pb-10 pt-10 sm:px-6 lg:pb-14 lg:pt-12">
          <div className="mx-auto grid max-w-[1040px] min-w-0 items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="relative z-20 min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-none">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered care concierge
              </div>
              <h1 className="max-w-full text-4xl font-black leading-[1.03] tracking-tight text-blue-950 sm:max-w-[520px] sm:text-5xl lg:text-[3.5rem]">
                <span className="block">Your journey</span>
                <span className="block">to better health,</span>
                <span className="block text-teal-500">simplified.</span>
              </h1>
              <p className="mt-6 max-w-full text-[15px] font-medium leading-7 text-slate-600 sm:max-w-[430px]">
                We help you find the right care, at the right time.
                <span className="block">
                  Compare options, book with confidence,
                </span>
                <span className="block">
                  and manage your health - all in one place.
                </span>
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/providers">
                  <Button
                    size="lg"
                    className="h-12 rounded-full bg-teal-500 px-6 text-sm font-bold text-white shadow-[0_14px_32px_rgba(20,184,166,0.28)] hover:bg-teal-600"
                  >
                    Find Care Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how-it-works" onClick={scrollToHowItWorks}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-sky-100 bg-white/85 px-6 text-sm font-bold text-blue-900 shadow-sm backdrop-blur hover:bg-white"
                  >
                    How It Works
                    <PlayCircle className="ml-2 h-4 w-4 text-blue-500" />
                  </Button>
                </a>
              </div>
            </div>

            <ReferenceHeroArt />
          </div>

          <div className="relative z-30 mx-auto mt-7 max-w-[calc(100vw-2.5rem)] sm:max-w-[1040px]">
            <div className="grid gap-2 rounded-[1.25rem] border border-white/90 bg-white/90 p-3 shadow-[0_24px_70px_rgba(15,76,117,0.12)] backdrop-blur-xl lg:grid-cols-[1.34fr_repeat(4,1fr)_auto]">
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

        <section className="px-5 py-12 sm:px-6">
          <div className="mx-auto max-w-[960px] text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-600">Care you can trust</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-blue-900 sm:text-4xl">
              Personalized. Private. Powerful.
            </h2>
            <div className="mt-10 grid overflow-hidden rounded-[1.25rem] bg-white/25 md:grid-cols-4 md:divide-x md:divide-blue-100">
              {patientBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="px-6 py-6 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600 shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900">{benefit.title}</h3>
                    <p className="mx-auto mt-3 max-w-[180px] text-xs font-medium leading-5 text-slate-600">{benefit.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-12 sm:px-6">
          <div className="mx-auto max-w-[1040px] rounded-[1.75rem] border border-white/90 bg-gradient-to-br from-white via-blue-50/70 to-sky-50/80 px-6 py-10 shadow-[0_24px_70px_rgba(15,76,117,0.09)] lg:px-12">
            <p className="text-center text-xs font-black uppercase tracking-[0.16em] text-teal-600">How it works</p>
            <h2 className="mt-3 text-center text-3xl font-black tracking-tight text-blue-900 sm:text-4xl">
              Care in four simple steps
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-4">
              {careSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative text-center">
                    {index < careSteps.length - 1 && (
                      <div className="absolute left-[63%] top-9 hidden h-px w-[74%] bg-teal-300/70 md:block">
                        <ArrowRight className="absolute -right-1.5 -top-2 h-4 w-4 text-teal-400" />
                      </div>
                    )}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_16px_40px_rgba(37,99,235,0.12)]">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="mt-6 flex items-start justify-center gap-3 text-left">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-black text-white">
                        {step.number}
                      </span>
                      <span className="max-w-[160px]">
                        <span className="block text-sm font-black text-slate-900">{step.title}</span>
                        <span className="mt-1 block text-xs font-medium leading-5 text-slate-600">{step.body}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-6">
          <div className="mx-auto max-w-[1040px] text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-600">Built for Calgary</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-blue-900 sm:text-4xl">
              Better care. Better outcomes.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {careStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 rounded-xl border border-white/90 bg-white/90 p-5 text-left shadow-[0_18px_46px_rgba(15,76,117,0.08)]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="block text-xl font-black text-blue-700">{stat.value}</span>
                      <span className="block text-xs font-bold text-slate-500">{stat.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-0 py-10">
          <div className="mx-auto grid max-w-[1040px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(15,76,117,0.1)] lg:grid-cols-[0.86fr_1.14fr]">
            <div className="relative z-10 flex flex-col justify-center bg-gradient-to-r from-white via-white/95 to-white/50 px-6 py-12 sm:px-8 lg:px-12">
              <h2 className="max-w-sm text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
                Better health. More peace of mind.
                <span className="block text-teal-500">Every step of the way.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-slate-600">
                We're here to make healthcare simpler, so you can focus on what matters most.
              </p>
              <Link href="/providers">
                <Button className="mt-7 w-fit rounded-full bg-teal-500 px-6 text-white shadow-[0_14px_32px_rgba(20,184,166,0.24)] hover:bg-teal-600">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative min-h-[360px] bg-sky-50">
              <img
                src="/assets/medlink-housecall-care.png"
                alt="A clinician providing calm in-home care to a patient"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/5 to-transparent" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100/80 bg-white/90 px-5 py-12 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-[1040px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <MedlinkLogo size="sm" />
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                AI-powered care concierge that helps you find the right care, at the right time, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-medium text-slate-600 sm:grid-cols-3">
              <Link href="/providers" className="hover:text-blue-700">Find Care</Link>
              <Link href="/apply" className="hover:text-blue-700">Join Our Network</Link>
              <a href="#how-it-works" onClick={scrollToHowItWorks} className="hover:text-blue-700">
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
              Privacy-first care workflows
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
