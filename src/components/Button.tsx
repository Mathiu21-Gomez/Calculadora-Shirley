import type { ReactNode } from 'react';

type Variant = 'default' | 'operator' | 'function' | 'accent' | 'danger';

type ButtonProps = {
  children: ReactNode;
  onPress: () => void;
  variant?: Variant;
  wide?: boolean;
  ariaLabel?: string;
  kbd?: string;
};

export function Button({ children, onPress, variant = 'default', wide, ariaLabel, kbd }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant}${wide ? ' btn--wide' : ''}`}
      onClick={onPress}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {kbd && <span className="btn__kbd" aria-hidden="true">{kbd}</span>}
      {children}
    </button>
  );
}
