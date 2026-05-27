interface PageBackgroundProps {
  image: string;
  position?: string;
  children: React.ReactNode;
}

export function PageBackground({ image, position = 'center 35%', children }: PageBackgroundProps) {
  return (
    <div className="flex-1 relative flex flex-col bg-brand-dark">
      {/* Background image fades in once loaded — avoids jarring flash */}
      <div
        className="absolute inset-0 bg-cover animate-bg-fade"
        style={{ backgroundImage: `url(${image})`, backgroundPosition: position }}
      />
      {/* Dark overlay — 65% keeps images clearly visible while keeping text legible */}
      <div className="absolute inset-0 bg-brand-dark/65 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
