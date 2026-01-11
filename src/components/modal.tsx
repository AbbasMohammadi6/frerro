import type { ReactNode } from 'react';
import { theme } from '../theme/theme';

type Props = {
  children: ReactNode;
}

export function Modal (props: Props) {
  const { children } = props;
  return (
    <scrollbox 
      position='absolute' 
      zIndex={2} 
      backgroundColor={theme.bg} 
      // TODO: see if these values are ok
      top={'25%'} 
      left={'25%'}
      width={'50%'}
    >
      {children}
    </scrollbox>
  );
}
