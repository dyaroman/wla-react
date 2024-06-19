import { InfoModalBtn } from './InfoModalBtn';
import { ThemeToggle } from './ThemeToggle';

export function AppControls() {
  return (
    <details className="mt" open>
      <summary>Useful:</summary>
      <div className="btn-group  mt">
        <ThemeToggle />
        <InfoModalBtn />
        <a href="./CHANGELOG.md" target="_blank" className="btn">
          changelog
        </a>
      </div>
    </details>
  );
}
