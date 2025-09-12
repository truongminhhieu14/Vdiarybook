"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  openOnHover?: boolean;
};

export default function Popover({ className, children, trigger, openOnHover }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  let hoverTimeout: NodeJS.Timeout;

  const togglePopover = () => {
    if (!openOnHover) setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    if (!openOnHover) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          setIsVisible(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openOnHover]);

  return (
    <div
      className="relative inline-block"
      ref={popoverRef}
      onMouseEnter={() => {
        if (openOnHover) {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => setIsVisible(true), 300);
        }
      }}
      onMouseLeave={() => {
        if (openOnHover) {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => setIsVisible(false), 200); 
        }
      }}
    >
      <div className="w-full" onClick={togglePopover}>
        {trigger}
      </div>
      {isVisible && (
        <div className={className}>
          {children}
        </div>
      )}
    </div>
  );
}
