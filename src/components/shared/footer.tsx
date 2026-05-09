export function Footer() {
  return (
    <footer className="border-t border-[#374151] bg-[#131314]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="font-sans text-xl font-semibold text-[#c3c6d4]">CapExray</span>
          <p className="font-sans text-sm text-[#64748B]">© 2024 CapExray Diagnostic Systems</p>
        </div>
        <div className="flex gap-6">
          {["Legal", "Diagnostic Methodology", "API Status", "Privacy"].map((label) => (
            <a
              key={label}
              href="#"
              className="font-mono text-xs text-[#64748B] transition-colors hover:text-[#F8FAFC]"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
