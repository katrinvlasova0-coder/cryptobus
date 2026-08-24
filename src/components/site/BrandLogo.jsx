import { Link } from 'react-router-dom';

export default function BrandLogo({ className = '', markClassName = 'h-8 w-8', wordmark = true }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className={`relative ${markClassName} rounded-lg bg-gradient-to-br from-electric to-teal flex items-center justify-center shrink-0`}
      >
        <div className="absolute inset-0.5 rounded-md bg-graphite flex items-center justify-center">
          <span className="font-display font-bold text-sm text-electric">C</span>
        </div>
      </div>
      {wordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          CRYPTO<span className="text-electric">BUS</span>
        </span>
      )}
      <span className="sr-only">Cryptobus home</span>
    </Link>
  );
}
