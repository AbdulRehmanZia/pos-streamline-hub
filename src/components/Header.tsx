import { Button } from "@/components/ui/button";
import { Monitor, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = (event, id) => {
    event.preventDefault(); 
    if (id === 'home') {
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Download", href: "#download" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-[50px]">
        <div className="flex items-center justify-between h-16">
          <a href="#" onClick={(e) => handleSmoothScroll(e, 'home')} className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Monitor className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gray-800">POS</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href.substring(1))}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href.substring(1))}
                  className="px-[50px] text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;