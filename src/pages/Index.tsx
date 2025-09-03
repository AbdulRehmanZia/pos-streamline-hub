import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DownloadSection from "@/components/Download";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="download">
          <DownloadSection />
        </div>
      </main>
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
