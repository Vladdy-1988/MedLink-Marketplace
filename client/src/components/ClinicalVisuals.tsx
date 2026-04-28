import { CalendarCheck, HeartPulse, Leaf, Plus, Search, ShieldCheck } from "lucide-react";

const journeySteps = [
  { number: "1", title: "Find", body: "Discover the right care" },
  { number: "2", title: "Compare", body: "Choose with confidence" },
  { number: "3", title: "Book", body: "Schedule with ease" },
  { number: "4", title: "Manage", body: "We're here, always" },
];

export function ClinicalHeroArt({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative isolate mx-auto aspect-[1.04] w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-sky-50 to-teal-50 shadow-[0_30px_90px_rgba(15,76,117,0.16)] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(45,212,191,0.28),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(96,165,250,0.22),transparent_34%)]" />
      <div className="absolute inset-x-10 bottom-8 h-20 rounded-full bg-sky-200/30 blur-3xl" />

      <svg
        viewBox="0 0 560 540"
        className="absolute inset-x-0 bottom-0 z-10 h-[82%] w-full drop-shadow-[0_28px_32px_rgba(15,76,117,0.16)]"
      >
        <path
          d="M358 78 C324 130 438 167 350 221 C272 269 179 286 159 407"
          fill="none"
          stroke="rgba(45, 128, 125, 0.16)"
          strokeLinecap="round"
          strokeWidth="74"
        />
        <path
          d="M358 78 C324 130 438 167 350 221 C272 269 179 286 159 407"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="58"
        />
      </svg>

      <div className="absolute left-[44%] top-[12%] z-20 h-40 w-28 -translate-x-1/2 rounded-t-full border-x-[18px] border-t-[18px] border-teal-200/80 bg-white/55 shadow-[0_20px_55px_rgba(20,184,166,0.18)] backdrop-blur">
        <div className="absolute inset-x-5 top-7 flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br from-teal-100 to-white text-teal-500 shadow-inner">
          <Plus className="h-10 w-10 stroke-[3]" />
        </div>
      </div>

      <div className="absolute left-[10%] top-[42%] z-30 h-28 w-28 rounded-full border border-white/80 bg-[radial-gradient(circle_at_32%_28%,white_0%,#dbeafe_28%,#a5f3fc_52%,#60a5fa_78%,#14b8a6_100%)] opacity-90 shadow-[0_18px_45px_rgba(96,165,250,0.35)]" />

      <Leaf className="absolute left-[9%] top-[30%] z-20 h-20 w-20 -rotate-12 text-teal-300/80" />
      <Leaf className="absolute left-[21%] top-[21%] z-20 h-16 w-16 rotate-[24deg] text-emerald-300/75" />
      <Leaf className="absolute bottom-[24%] left-[27%] z-20 h-16 w-16 -rotate-[30deg] text-teal-300/75" />
      <Leaf className="absolute right-[22%] top-[19%] z-20 h-14 w-14 rotate-12 text-emerald-300/70" />
      <Leaf className="absolute right-[13%] bottom-[29%] z-20 h-16 w-16 rotate-[28deg] text-teal-300/70" />

      <div className="absolute right-5 top-20 z-40 hidden w-40 space-y-3 sm:block">
        {journeySteps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,76,117,0.12)] backdrop-blur"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                {step.number}
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-800">{step.title}</span>
                <span className="block text-[11px] leading-4 text-slate-500">{step.body}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-40 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-lg backdrop-blur">
          <Search className="mb-2 h-5 w-5 text-blue-500" />
          <div className="text-[11px] font-semibold text-slate-700">Find care</div>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-lg backdrop-blur">
          <CalendarCheck className="mb-2 h-5 w-5 text-teal-500" />
          <div className="text-[11px] font-semibold text-slate-700">Book visit</div>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-lg backdrop-blur">
          <ShieldCheck className="mb-2 h-5 w-5 text-blue-500" />
          <div className="text-[11px] font-semibold text-slate-700">Stay secure</div>
        </div>
      </div>

      <div className="absolute left-7 top-7 z-30 flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-xs font-bold text-teal-700 shadow-lg backdrop-blur">
        <HeartPulse className="h-4 w-4" />
        In-home care
      </div>
    </div>
  );
}
