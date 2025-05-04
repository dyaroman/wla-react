import { Burger } from './Burger';
import { TableInfo } from './TableInfo';
import { ResultsControls } from './ResultsControls';
import { Logo } from './Logo';
import { Counter } from './Counter';
import { Drawer } from './Drawer';
import { SIDEBAR } from '../features/drawer/drawer.constants';

export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <Logo />
        <Counter />
        <Burger />
      </div>

      <Drawer
        drawerId={SIDEBAR}
        position="left"
        maxSize="300px"
        title="Sidebar"
      >
        <TableInfo />
        <ResultsControls />
      </Drawer>
    </header>
  );
}
