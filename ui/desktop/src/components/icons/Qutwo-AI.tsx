import glyphUrl from '../../images/iconTemplate@2x.png';

export function QutwoAi({ className = '' }) {
  return (
    <span
      role="img"
      aria-label="Qutwo-AI"
      className={`inline-block bg-current ${className}`}
      style={{
        width: 24,
        height: 24,
        WebkitMaskImage: `url(${glyphUrl})`,
        maskImage: `url(${glyphUrl})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}
