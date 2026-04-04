import "../styles/Loader.css";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        
        {/* HOUSE ICON */}
        <div className="house">
          <div className="roof"></div>
          <div className="walls">
            <div className="door"></div>
          </div>
        </div>
        
        {/* LOGO / BRAND */}
        <div className="loader-logo">
          <span className="logo-rent">Rent</span>
          <span className="logo-home">Home</span>
        </div>

        {/* ANIMATED LINE */}
        <div className="loader-line"></div>

        {/* TEXT */}
        <p className="loader-text">Finding homes made simple…</p>
      </div>
    </div>
  );
}
