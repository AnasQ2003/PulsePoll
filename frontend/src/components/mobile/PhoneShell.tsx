import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-0 md:p-6 overflow-hidden relative">
      {/* Ambient background glows for desktop preview mode */}
      <div className="hidden md:block absolute top-[-10%] right-[-10%] size-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.68_0.21_36/_0.15),transparent_70%)] blur-[120px] pointer-events-none select-none" />
      <div className="hidden md:block absolute bottom-[-10%] left-[-10%] size-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.60_0.20_250/_0.12),transparent_70%)] blur-[120px] pointer-events-none select-none" />

      {/* Realistic Smart Phone Shell Container */}
      <div className="relative phone-container select-none">
        {/* Left Side Physical Buttons (Action Button, Volume Up, Volume Down) */}
        <div className="hidden md:block absolute left-[-16px] top-[140px] w-[5px] h-[35px] bg-[#1c1c1e] rounded-l-md border-y border-l border-neutral-700 z-0 shadow-[-2px_4px_6px_rgba(0,0,0,0.4)]" />
        <div className="hidden md:block absolute left-[-16px] top-[195px] w-[5px] h-[50px] bg-[#1c1c1e] rounded-l-md border-y border-l border-neutral-700 z-0 shadow-[-2px_4px_6px_rgba(0,0,0,0.4)]" />
        <div className="hidden md:block absolute left-[-16px] top-[260px] w-[5px] h-[50px] bg-[#1c1c1e] rounded-l-md border-y border-l border-neutral-700 z-0 shadow-[-2px_4px_6px_rgba(0,0,0,0.4)]" />

        {/* Right Side Physical Button (Power / Side Button) */}
        <div className="hidden md:block absolute right-[-16px] top-[215px] w-[5px] h-[80px] bg-[#1c1c1e] rounded-r-md border-y border-r border-neutral-700 z-0 shadow-[2px_4px_6px_rgba(0,0,0,0.4)]" />

        {/* Smartphone Outer Bezel & Body */}
        <div className="phone-frame ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),_inset_0_0_1px_1px_rgba(255,255,255,0.1)]">
          {/* Dynamic Island Notch */}
          <div className="notch px-4 select-none">
            {/* Camera lens and sensor simulation */}
            <div className="size-2 rounded-full bg-[#111] ring-1 ring-neutral-800" />
            <div className="w-10 h-1.5 rounded-full bg-[#0d0d0d] opacity-90" />
          </div>

          {/* Phone Screen Glass Wrapper */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative md:rounded-[37px] bg-background">
            {children}
          </div>

          {/* Bottom iOS style Home Indicator bar */}
          <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-neutral-600/80 z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
