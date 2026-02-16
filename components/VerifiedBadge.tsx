import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function VerifiedBadge({
  verified,
  size = 'md',
  showText = false,
}: VerifiedBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      <CheckCircle2 className={`${sizeClasses[size]} text-accent`} />
      {showText && (
        <span className={`${textSizes[size]} font-medium text-accent`}>
          Verified
        </span>
      )}
    </div>
  );
}
