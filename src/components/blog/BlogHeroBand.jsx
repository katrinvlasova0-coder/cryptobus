export default function BlogHeroBand({ kicker, title }) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-graphite via-secondary to-graphite">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-electric mb-3">
            {kicker}
          </p>
        ) : null}
        {title ? (
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight max-w-3xl">
            {title}
          </h1>
        ) : null}
      </div>
    </div>
  );
}
