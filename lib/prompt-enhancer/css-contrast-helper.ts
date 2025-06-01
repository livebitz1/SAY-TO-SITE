// CSS contrast helper to ensure proper text contrast in generated code

export function generateContrastHelperCSS(): string {
  return `
/* Text contrast helper classes */
.text-dark {
  color: #212529 !important;
}

.text-light {
  color: #f8f9fa !important;
}

/* Background overlay helpers for better text contrast */
.bg-overlay-dark {
  position: relative;
}

.bg-overlay-dark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.bg-overlay-dark > * {
  position: relative;
  z-index: 2;
}

.bg-overlay-light {
  position: relative;
}

.bg-overlay-light::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.bg-overlay-light > * {
  position: relative;
  z-index: 2;
}

/* Gradient background for better text contrast */
.bg-gradient-dark {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
}

.bg-gradient-light {
  background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
}

/* Text shadow for better readability on image backgrounds */
.text-shadow-dark {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.text-shadow-light {
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
}

/* Box shadow for text on image backgrounds */
.text-box-dark {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.text-box-light {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
`
}
