import { SeverityLevel } from '@/types';

interface Props {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
}

export default function SeverityBadge({ severity, size = 'md' }: Props) {
  const labels: Record<SeverityLevel, string> = {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
    info: 'INFO',
  };

  return (
    <span
      className={`tag severity-${severity}`}
      style={{ fontSize: size === 'sm' ? 10 : 11 }}
    >
      {labels[severity]}
    </span>
  );
}
