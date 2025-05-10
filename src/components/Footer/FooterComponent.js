import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Made with <span role="img" aria-label="love">❤️</span> by{" "}
        <a 
          href="https://github.com/anishfyi" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          @anishfyi
        </a>
      </p>
    </footer>
  );
};

export default Footer; 