import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LandingHeader() {
  return (
    <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 font-display text-sm font-bold text-white ring-1 ring-white/20">
          CW
        </div>
        <span className="font-display text-lg font-semibold text-white">Co-Work</span>
      </div>
      <Link href="/login">
        <Button
          size="sm"
          className="!border !border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
        >
          Masuk
        </Button>
      </Link>
    </header>
  );
}
