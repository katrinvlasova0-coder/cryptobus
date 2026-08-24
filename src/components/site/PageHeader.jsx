export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">{eyebrow}</div>}
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}