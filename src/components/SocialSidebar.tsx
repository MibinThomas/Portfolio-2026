import './SocialSidebar.css';

export function SocialSidebar() {
  return (
    <div className="social-sidebar">
      <div className="social-links">
        <a href="https://www.instagram.com/mibz.t/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.linkedin.com/in/mibin-thomas/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://www.behance.net/mibinthomas1" target="_blank" rel="noopener noreferrer">Behance</a>
      </div>
      <div className="line-separator"></div>
      <div className="scroll-indicator">Scroll</div>
    </div>
  );
}
