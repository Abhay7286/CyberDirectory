import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, User, Plus, Briefcase, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";

const Navigation = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const goToProfile = () => {
    navigate("/profile");
    setMobileMenuOpen(false);
  };

  const goToAddTool = () => {
    navigate("/submit");
    setMobileMenuOpen(false);
  };

  const goToAdmin = () => {
    navigate("/admin");
    setMobileMenuOpen(false);
  };

  const goToCompare = () => {
    navigate("/compare");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-1 z-10">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">
              <Link to="/">CyberDirectory</Link>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === "/" ? "text-black" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>

            <Link
              to="/google-dork"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === "/google-dork"
                  ? "text-black"
                  : "text-muted-foreground"
              }`}
            >
              Google Dork
            </Link>

            <Link
              to="/compare"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === "/compare"
                  ? "text-black"
                  : "text-muted-foreground"
              }`}
            >
              Compare
            </Link>

            <Link
              to="/roadmap"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === "/roadmap"
                  ? "text-black"
                  : "text-muted-foreground"
              }`}
            >
              Roadmap
            </Link>
            <Link
              to="/collections"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === "/collections"
                  ? "text-black"
                  : "text-muted-foreground"
              }`}
            >
              Collections
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToAddTool}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Tool
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToProfile}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>

                {user.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToAdmin}
                    className="gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    Admin Dashboard
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  Login
                </Button>
                <Button size="sm" onClick={handleSignup}>
                  Sign Up
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background block">
            <div className="container px-4 py-4 space-y-4">
              <Link
                to="/"
                className={`block text-base font-medium hover:text-primary transition-colors ${
                  location.pathname === "/" ? "text-black" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/osint"
                className={`block text-base font-medium hover:text-primary transition-colors ${
                  location.pathname === "/osint"
                    ? "text-black"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                OSINT
              </Link>

              <Link
                to="/google-dork"
                className={`block text-base font-medium hover:text-primary transition-colors ${
                  location.pathname === "/google-dork"
                    ? "text-black"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Google Dork
              </Link>

              <Link
                to="/compare"
                className={`block text-base font-medium hover:text-primary transition-colors ${
                  location.pathname === "/compare"
                    ? "text-black"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Compare
              </Link>
              <Link
                to="/roadmap"
                className={`block text-base font-medium hover:text-primary transition-colors ${
                  location.pathname === "/roadmap"
                    ? "text-black"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Roadmap
              </Link>
              <Link
                to="/collections"
                className={`block text-base font-medium hover:text-primary transition-colors ${
                  location.pathname === "/collections"
                    ? "text-black"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>

              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={goToAddTool}
                    >
                      <Plus className="h-4 w-4" />
                      Add Tool
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={goToProfile}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Button>

                    {user.role === "admin" && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={goToAdmin}
                      >
                        <Briefcase className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                    <Button className="w-full" onClick={handleSignup}>
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Navigation;
