import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, CalendarCheck, HeartPulse, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarketplacePageHeroProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  supportingText?: string;
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
  imageSrc?: string;
  imageAlt?: string;
};

function HeroLink({ href, children }: { href: string; children: ReactNode }) {
  const externalHref =
    href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");

  if (externalHref) {
    return <a href={href}>{children}</a>;
  }

  return <Link href={href}>{children}</Link>;
}

export function MarketplacePageHero({
  eyebrow,
  title,
  accent,
  description,
  supportingText,
  primaryCta,
  secondaryCta,
  imageSrc = "/assets/medlink-housecall-care.png",
  imageAlt = "A clinician providing calm in-home healthcare support",
}: MarketplacePageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#f7fbff] px-5 py-16 sm:px-6 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(20,184,166,0.14),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(96,165,250,0.18),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f5fbff_100%)]" />
      <div className="mx-auto grid max-w-6xl min-w-0 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="w-full max-w-[min(350px,calc(100vw-2.5rem))] min-w-0 sm:max-w-none">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-teal-700">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h1 className="max-w-full text-4xl font-black leading-[1.04] tracking-tight text-blue-950 sm:max-w-2xl sm:text-6xl sm:leading-[1.02]">
            {title}
            <span className="block text-teal-500">{accent}</span>
          </h1>
          <p className="mt-6 w-full max-w-full break-words text-base font-medium leading-8 text-slate-600 sm:max-w-xl sm:text-lg">
            {description}
          </p>
          {supportingText && (
            <p className="mt-3 w-full max-w-full break-words text-base font-medium leading-7 text-slate-500 sm:max-w-xl">
              {supportingText}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HeroLink href={primaryCta.href}>
              <Button className="h-12 rounded-full bg-teal-500 px-6 text-base font-bold text-white shadow-[0_14px_32px_rgba(20,184,166,0.26)] hover:bg-teal-600">
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </HeroLink>
            {secondaryCta && (
              <HeroLink href={secondaryCta.href}>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-sky-100 bg-white/85 px-6 text-base font-bold text-blue-900 shadow-sm backdrop-blur hover:bg-white"
                >
                  {secondaryCta.label}
                </Button>
              </HeroLink>
            )}
          </div>
        </div>

        <div className="relative min-h-[320px] w-full max-w-[min(350px,calc(100vw-2.5rem))] overflow-hidden rounded-[1.5rem] border border-white/90 bg-white shadow-[0_24px_70px_rgba(15,76,117,0.14)] sm:min-h-[360px] sm:max-w-none">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/5 to-transparent" />
          <div className="absolute left-5 top-5 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_16px_42px_rgba(15,76,117,0.14)] backdrop-blur">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Verified" },
                { icon: CalendarCheck, label: "Booked" },
                { icon: HeartPulse, label: "At home" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-sm font-black text-slate-700">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-base font-bold text-blue-900 shadow-[0_16px_42px_rgba(15,76,117,0.14)] backdrop-blur sm:left-auto sm:right-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Stethoscope className="h-4 w-4" />
            </span>
            House-call ready
          </div>
        </div>
      </div>
    </section>
  );
}
