import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-muted-foreground">404</h1>
        <h2 className="text-2xl font-medium">Page Not Found</h2>
        <p className="text-muted-foreground">The page you requested does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-electric text-graphite font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
