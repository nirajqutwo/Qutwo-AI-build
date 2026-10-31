import { useColorMode } from '@docusaurus/theme-common';

export const QutwoAiLogo = (props: { className?: string }) => {
  const { colorMode } = useColorMode();
  
  const logoSrc = colorMode === 'dark' 
    ? 'img/qutwo-ai-logo-white.png' 
    : 'img/qutwo-ai-logo-black.png';
  
  const logoAlt = 'qutwo-ai logo';

  return (
    <img
      src={logoSrc}
      alt={logoAlt}
      className={props.className}
      style={{ height: 'auto', maxWidth: '100%' }}
    />
  );
};
