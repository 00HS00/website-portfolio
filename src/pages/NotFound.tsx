import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 pt-20 text-center">
      <div>
        <p className="text-sm text-gradient font-medium">404</p>
        <h1 className="mt-4 font-display text-3xl font-medium text-ink sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-ink-muted">The page you're looking for doesn't exist or has moved.</p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-blue/40"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back home
        </Link>
      </div>
    </section>
  );
}
