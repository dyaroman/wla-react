import { Logo } from './Logo';
import { Counter } from './Counter';
import { ToggleButtonsPanel } from './ToggleButtonsPanel';

export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <Logo />
        <Counter />
        <ToggleButtonsPanel />
      </div>
    </header>
  );
}
