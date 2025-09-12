import React, { useEffect } from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement>, onClose: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if(ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [ref, onClose]);
}