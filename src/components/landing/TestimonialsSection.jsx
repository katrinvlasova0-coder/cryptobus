import { ShieldCheck } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">Testimonials</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Trusted by Global Businesses</h2>
        </div>
        <div className="glass rounded-2xl p-10 text-center">
          <ShieldCheck className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Verified client testimonials will appear here once published through the Cryptobus CMS. We do not display generated reviews as real testimonials.
          </p>
        </div>
      </div>
    </section>
  );
}