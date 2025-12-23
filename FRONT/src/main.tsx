import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { WishlistProvider } from "./context/WishlistContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import i18n from "./i18n"; // importer l'instance
import { I18nextProvider } from "react-i18next";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <WishlistProvider>
              <CartProvider> 
              <App />
              </CartProvider>
            </WishlistProvider>
          </BrowserRouter>
        </SidebarProvider>
      </ThemeProvider>
      </I18nextProvider>
    </HelmetProvider>
  </React.StrictMode>
);
