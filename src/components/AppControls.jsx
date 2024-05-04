import { InfoModalBtn } from './InfoModalBtn';
import { ThemeToggle } from './ThemeToggle';

export function AppControls() {
  return (
    <div className="btn-group">
      <ThemeToggle />
      <InfoModalBtn />
      <a href="./CHANGELOG.md" target="_blank" className="link">
        changelog
      </a>
    </div>
  );
}
