import React, { useEffect, useState } from 'react';

type Props = React.HTMLAttributes<HTMLDivElement>;

const ThemeToggle: React.FC<Props> = ({ className, ...rest }) => {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
        else {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    };

    return (
        <div className={`flex items-centers ${className ?? ''}`} {...rest}>
            <label htmlFor="dark-toggle" className="flex items-center cursor-pointer select-none">
                <div className="relative">
                    <input
                        id="dark-toggle"
                        name="dark-mode"
                        type="checkbox"
                        className="sr-only peer"
                        checked={isDark}
                        onChange={toggleTheme}
                        aria-checked={isDark}
                        aria-label="Toggle dark mode"
                    />
                    <div className="w-14 h-8 rounded-full border border-gray-900 dark:border-white bg-white dark:bg-gray-900"></div>
                    <div className="dot absolute left-1 top-1 w-6 h-6 rounded-full bg-gray-800 dark:bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></div>
                </div>
                <div className="ml-3 text-gray-900 dark:text-white font-medium" />
            </label>
        </div>
    );
};

export default ThemeToggle;
