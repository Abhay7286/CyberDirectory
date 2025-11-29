import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import { HelmetProvider } from "react-helmet-async";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Submit from "./pages/Submit";
import Report from "./pages/Report";
import OSINT from "./pages/OSINT";
import GoogleDork from "./pages/GoogleDork";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/scrollToTop";
import Comparison from "./pages/Camparison";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient();

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      style={{ transformOrigin: "left" }}
      transition={{ duration: 0.1 }}
    />
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
         <ScrollToTop />
          <ScrollProgressBar />
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Index />
                </PageTransition>
              }
            />
            <Route
              path="/tools"
              element={
                <PageTransition>
                  <Tools />
                </PageTransition>
              }
            />
            <Route
              path="/tools/:id"
              element={
                <PageTransition>
                  <ToolDetail />
                </PageTransition>
              }
            />
            <Route
              path="/submit"
              element={
                <PageTransition>
                  <Submit />
                </PageTransition>
              }
            />
            <Route
              path="/report"
              element={
                <PageTransition>
                  <Report />
                </PageTransition>
              }
            />
            <Route
              path="/osint"
              element={
                <PageTransition>
                  <OSINT />
                </PageTransition>
              }
            />
            <Route
              path="/google-dork"
              element={
                <PageTransition>
                  <GoogleDork />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              }
            />
            <Route
              path="/compare"
              element={
                <PageTransition>
                  <Comparison />
                </PageTransition>
              }
            />
            <Route
              path="/roadmap"
              element={
                <PageTransition>
                  <Roadmap/>
                </PageTransition>
              }
            />
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <Admin />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
