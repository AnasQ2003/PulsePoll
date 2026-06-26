import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-0 sm:p-6">
      <div className="phone-frame">
        <div className="notch" />
        {children}
      </div>
    </div>
  );
}
