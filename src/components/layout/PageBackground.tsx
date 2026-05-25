interface PageBackgroundProps {
  image: string;
  position?: string;
  children: React.ReactNode;
}

export function PageBackground({ image, position = 'center 35%', children }: PageBackgroundProps) {
  return (
    <div
      className="flex-1 relative flex flex-col"
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: position }}
    >
      <div className="absolute inset-0 bg-brand-dark/88 pointer-events-none" />
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
