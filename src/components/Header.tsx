import { Button } from "@/components/ui/button";
import { Monitor, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-0">
        <div className="flex items-center  justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Monitor className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gray-800">POS</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#download" className="text-gray-700 hover:text-gray-900 transition-colors">
              Download
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#download" className="text-gray-700 hover:text-gray-900 transition-colors">
                Download
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;