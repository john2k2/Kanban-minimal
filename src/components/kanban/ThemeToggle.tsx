import { SunIcon, MoonIcon } from "@/components/icons";

interface ThemeToggleProps {
    pressed: boolean;
    onToggle: () => void;
}

export function ThemeToggle({ pressed, onToggle }: ThemeToggleProps) {
    return (
        <div className="theme-toggle">
            <button
                onClick={onToggle}
                aria-pressed={pressed}
                aria-label={pressed ? "Switch to light mode" : "Switch to dark mode"}
                className="focus-outline"
                type="button"
            >
                <span className="icon sun">
                    <SunIcon size={12} />
                </span>
                <span className="icon moon">
                    <MoonIcon size={12} />
                </span>
                <span className="thumb" />
            </button>
            <span className="font-medium tracking-tight select-none text-[11px] text-textc-tertiary dark:text-textc-tertiaryDark">
                {pressed ? "Dark" : "Light"}
            </span>
        </div>
    );
}
