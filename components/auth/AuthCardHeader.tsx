interface AuthCardHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthCardHeader({ title, subtitle }: AuthCardHeaderProps) {
  return (
    <>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-navy-800 font-display text-lg font-bold text-white shadow-md">
        CW
      </div>
      <h1 className="text-center font-display text-xl font-semibold text-ink-950">
        {title}
      </h1>
      <p className="mb-6 mt-1 text-center text-sm text-ink-600">
        {subtitle}
      </p>
    </>
  );
}
