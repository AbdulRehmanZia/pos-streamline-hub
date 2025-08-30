import { Monitor } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - POS Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-foreground/10 rounded-xl">
                <Monitor className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold">RetailPOS</span>
            </div>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Complete retail management solution designed to streamline your
              business operations and boost productivity.
            </p>
          </div>

          {/* Right side - Contact Info */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-xl mb-6 text-center">
              Contact Us
            </h3>
            <div className="space-y-4 text-lg w-full max-w-sm">
              {/* WhatsApp */}
              <a
                href="https://wa.me/923102487705"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors justify-center"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>+92 310 2487705 (WhatsApp)</span>
              </a>

              {/* Gmail */}
              <a
                href="mailto:bootcamp.pos.sender@gmail.com"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335] hover:text-white transition-colors justify-center"
              >
                <SiGmail className="w-5 h-5" />
                <span>bootcamp.pos.sender@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 RetailPOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
