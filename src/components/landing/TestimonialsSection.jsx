const TESTIMONIALS = [
  {
    quote:
      'We needed a clean way to settle supplier invoices in crypto without turning our finance team into traders. Cryptobus made the workflow feel corporate from day one.',
    name: 'Elena Marković',
    role: 'CFO',
    company: 'Nordic Trade Systems',
  },
  {
    quote:
      'The 0.5% fee and KYB-first onboarding were exactly what our board wanted to see. OTC desk response was fast when we had a larger block to move.',
    name: 'James Okonkwo',
    role: 'Treasury Lead',
    company: 'Atlas Logistics Group',
  },
  {
    quote:
      'Invoice upload, beneficiary checks, and settlement confirmation in one place — finally a B2B crypto stack that matches how our operations team actually works.',
    name: 'Sofia Brandt',
    role: 'Head of Payments',
    company: 'Helix Commerce AG',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">
            Testimonials
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Trusted by Global Businesses</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.company} className="glass rounded-2xl p-6 flex flex-col">
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-border">
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {t.role}, {t.company}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
