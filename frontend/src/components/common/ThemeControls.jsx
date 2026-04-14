import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../../store/themeStore";

const schemes = [
  { value: "slate", label: "Slate" },
  { value: "zinc", label: "Zinc" },
  { value: "stone", label: "Stone" },
  { value: "neutral", label: "Neutral" },
];

function ColorDot({ scheme }) {
  return <span className={`theme-dot theme-dot-${scheme}`} aria-hidden="true" />;
}

export default function ThemeControls({ compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const mode = useThemeStore((state) => state.mode);
  const scheme = useThemeStore((state) => state.scheme);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const setScheme = useThemeStore((state) => state.setScheme);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "rounded-xl border border-gray-200/80 bg-white/80 px-2 py-1 shadow-sm"}`}>
      <button
        type="button"
        onClick={toggleMode}
        className="theme-switch"
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
        title="Toggle light and dark mode"
      >
        <span className={`theme-switch-knob ${mode === "dark" ? "translate-x-5" : "translate-x-0"}`} />
        <span className="theme-switch-label">{mode === "dark" ? "Dark" : "Light"}</span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="theme-selector-btn"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          title="Choose accent scheme"
        >
          <ColorDot scheme={scheme} />
          {!compact && <span className="text-xs font-semibold text-gray-700">{scheme}</span>}
          <svg className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="theme-dropdown" role="listbox">
            {schemes.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`theme-dropdown-item ${scheme === option.value ? "is-active" : ""}`}
                onClick={() => {
                  setScheme(option.value);
                  setIsOpen(false);
                }}
              >
                <ColorDot scheme={option.value} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
