"use client";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/base-button";
import { Github, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const Header = ({ setMobileOpen }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`bg-white dark:bg-black dark:border-gray-200/30 border-b fixed top-0 left-0 w-full z-50`}
    >
      <div className="px-4 py-1.5 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary dark:text-white tracking-tight flex items-center gap-1">
          {theme === "dark" ? (
            <div className="flex items-start gap-0.5">
              <img
                src="/DarkModeLogo.png"
                className="md:h-9 md:w-8 w-7.5 h-9"
                alt="Image Logo"
              />
              <div className="md:-space-y-2 -space-y-1.5 -mt-0.5 dark:text-white">
                <h4 className="md:text-lg text-base">Documate</h4>
                <p className="text-xs">by JMDev</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-0.5">
              <img
                src="/LightModeLogo.png"
                className="md:h-9 md:w-8 w-7.5 h-9"
                alt="Image Logo"
              />
              <div className="md:-space-y-2 -space-y-1.5 -mt-0.5 text-primary">
                <h4 className="text-lg">Documate</h4>
                <p className="text-xs">by JMDev</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost">
            <AnimatedThemeToggler />
          </Button>
          <a href="https://github.com/jmdev-git" target="_blank">
            <Button variant="ghost">
              <Github className="dark:text-white" />
            </Button>
          </a>
          <Button onClick={() => signOut()} variant="ghost">
            <LogOut className="dark:text-white" />
          </Button>
          <Button
            onClick={() => setMobileOpen((prev) => !prev)}
            variant="ghost"
            className={"md:hidden block"}
          >
            <Menu className="dark:text-white" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
