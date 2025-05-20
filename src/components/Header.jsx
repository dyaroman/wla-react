import { Logo } from './Logo';
import { Counter } from './Counter';
import { ToggleButtonsPanel } from './ToggleButtonsPanel';

export function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <ToggleButtonsPanel position="left" />
          <div className="flex-row">
            <Logo />
            <Counter />
          </div>
          <ToggleButtonsPanel position="right" />
        </div>
      </div>
    </header>
  );
}
