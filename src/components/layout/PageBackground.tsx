interface PageBackgroundProps {
  image: string;
  position?: string;
  children: React.ReactNode;
}

export function PageBackground({ image, position = 'center 35%', children }: PageBackgroundProps) {
  return (
    <div className="flex-1 relative flex flex-col bg-brand-dark print:bg-transparent print:block">
      {/* Background image — hidden on print to avoid interfering with page layout */}
      <div
        className="absolute inset-0 bg-cover animate-bg-fade print:hidden"
        style={{ backgroundImage: `url(${image})`, backgroundPosition: position }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/65 pointer-events-none print:hidden" />
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0 print:block print:min-h-0">
        {children}
      </div>
    </div>
  );
}
