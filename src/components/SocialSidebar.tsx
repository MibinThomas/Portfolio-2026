import './SocialSidebar.css';

export function SocialSidebar() {
  return (
    <div className="social-sidebar">
      <div className="social-links">
        <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.linkedin.com/in/mibin-thomas/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Behance</a>
      </div>
      <div className="line-separator"></div>
      <div className="scroll-indicator">Scroll</div>
    </div>
  );
}
