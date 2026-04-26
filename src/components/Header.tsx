import { Menu } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="fixed-header">
      <div className="logo">MT.</div>
      <button className="menu-btn" aria-label="Open menu">
        <Menu size={24} color="#fff" />
      </button>
    </header>
  );
}
