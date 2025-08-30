import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Monitor, Cpu, HardDrive, Zap } from "lucide-react";

const systemRequirements = [
  { icon: Monitor, label: "Windows 10/11", detail: "64-bit required" },
  { icon: Cpu, label: "Intel i3 or AMD", detail: "2.0 GHz minimum" },
  { icon: HardDrive, label: "2GB Storage", detail: "Plus data space" },
  { icon: Zap, label: "4GB RAM", detail: "8GB recommended" },
];

const DownloadSection = () => {
  const handleDownload = () => {
    // Replace with your actual download link
    const downloadUrl = "#";
    window.open(downloadUrl, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Download our desktop POS application and start streamlining your retail operations today.
          </p>
          
          <Card className="mb-12 shadow-feature">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    POS Desktop Application
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Complete retail management solution with advanced features, 
                    analytics, and seamless integration. Works offline and online.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Version 2.1.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Size: 145 MB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Last updated: Dec 2024</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="download" 
                    size="lg" 
                    onClick={handleDownload}
                    className="text-xl px-12 py-8 mb-4"
                  >
                    <Download className="w-6 h-6" />
                    Download Now
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Free trial • No credit card required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-8">
              System Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {systemRequirements.map((req, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <req.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-foreground mb-1">
                      {req.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {req.detail}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;