import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./app.tsx";
import { config } from "./wagmi.ts";

import "./styles/index.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./themes/context/index.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: <needed for now>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
