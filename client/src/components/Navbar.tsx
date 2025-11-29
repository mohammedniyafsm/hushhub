"use client";

import { bricolage_grotesque } from "@/lib/font";
import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex px-4 sm:px-8 py-6">
        <h1 className={`text-lg font-bold ${bricolage_grotesque}`}>
          HushHub
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-between px-4 sm:px-8 py-6">
      <h1 className={`text-lg font-bold ${bricolage_grotesque}`}>
        HushHub
      </h1>

      <button
        className="ml-4"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <MoonIcon className="w-[18px] h-[18px]" />
        ) : (
          <SunIcon className="w-[18px] h-[18px]" />
        )}
      </button>
    </div>
  );
}

export default Navbar;
