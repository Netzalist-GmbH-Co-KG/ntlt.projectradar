interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`h-12 bg-neutral-100 border-t border-neutral-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-neutral-500">
            Project Radar v0.1.0 © 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
