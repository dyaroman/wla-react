import { InfoModalBtn } from './InfoModalBtn';
import { ThemeToggle } from './ThemeToggle';

export function AppControls() {
  return (
    <div className="btn-group  mt">
      <ThemeToggle />
      <InfoModalBtn />
    </div>
  );
}
