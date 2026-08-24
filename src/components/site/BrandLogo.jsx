import { Link } from 'react-router-dom';

export default function BrandLogo({ className = '', markClassName = 'h-8 w-8', wordmark = true }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}logo-mark.png`}
        alt=""
        width={32}
        height={32}
        className={`${markClassName} object-contain shrink-0`}
        decoding="async"
      />
      {wordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          CRYPTO<span className="text-electric">BUS</span>
        </span>
      )}
      <span className="sr-only">Cryptobus home</span>
    </Link>
  );
}
