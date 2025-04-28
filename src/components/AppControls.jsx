import { InfoModalBtn } from './InfoModalBtn';
import { ThemeToggle } from './ThemeToggle';

export function AppControls() {
  return (
    <div className="mt">
      <div className="btn-group  mt">
        <ThemeToggle />
        <InfoModalBtn />
        <a href="./CHANGELOG.md" target="_blank" className="external-link">
          changelog
        </a>
      </div>
    </div>
  );
}
