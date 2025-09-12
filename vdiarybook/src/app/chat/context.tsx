"use client";

import { createContext, useContext, useState } from "react";

const MeesageContext = createContext({
  showPopoverSearchMessage: false,
  onClosePopover: () => {},
});

export function useMessageContext (){
    return useContext(MeesageContext);
}

export function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPopoverSearchMessage, setShowPopoverSearchMessage] =
    useState<boolean>(false);
  const onClosePopover = () =>
    setShowPopoverSearchMessage(!showPopoverSearchMessage);
  return (
    <MeesageContext.Provider
      value={{ showPopoverSearchMessage, onClosePopover }}
    >
      {children}
    </MeesageContext.Provider>
  );
}