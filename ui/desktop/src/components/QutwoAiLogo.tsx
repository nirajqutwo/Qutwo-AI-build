import { QutwoAi } from './icons/Qutwo-AI';
import { cn } from '../utils';

interface QutwoAiLogoProps {
  className?: string;
  size?: 'default' | 'small';
  hover?: boolean;
}

export default function QutwoAiLogo({
  className = '',
  size = 'default',
  hover = true,
}: QutwoAiLogoProps) {
  const sizes = {
    default: {
      frame: 'w-16 h-16',
      rain: 'w-[275px] h-[275px]',
      qutwo_ai: 'w-16 h-16',
    },
    small: {
      frame: 'w-8 h-8',
      rain: 'w-[150px] h-[150px]',
      qutwo_ai: 'w-8 h-8',
    },
  } as const;

  const currentSize = sizes[size];

  return (
    <div
      className={cn(
        className,
        currentSize.frame,
        'relative overflow-hidden',
        hover && 'group/with-hover'
      )}
    >
      <QutwoAi className={cn(currentSize.qutwo_ai, 'absolute left-0 bottom-0 z-2')} />
    </div>
  );
}
