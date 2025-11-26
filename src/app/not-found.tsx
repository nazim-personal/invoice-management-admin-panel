
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import Logo from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="max-w-md">
        <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
