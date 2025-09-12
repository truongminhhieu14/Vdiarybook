"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import UserInitializer from "@/components/UserInitializer";
import { AppProvider } from "@/context/app.context";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./getQueryClient";

export default function ClientLayout({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={getQueryClient}>
        <AppProvider>
          <UserInitializer />
          <ToastContainer />
          <Header />
          {children}
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
