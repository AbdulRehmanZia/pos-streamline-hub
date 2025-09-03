import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "5,000",
      products: "Up to 100",
      categories: "Up to 10",
      members: "Up to 3",
      features: ["Products + Categories", "Basic Reports"],
      highlighted: false,
    },
    {
      name: "Standard",
      price: "10,000",
      products: "Up to 1,000",
      categories: "Up to 100",
      members: "Up to 7",
      features: [
        "Products + Categories",
        "Members Management",
        "Advanced Reporting",
        "Payment Processing",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "15,000",
      products: "Unlimited",
      categories: "Unlimited",
      members: "Unlimited",
      features: [
        "All Standard features",
        "Advanced Analytics",
        "Priority Support",
        "Custom Integrations",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="py-24 bg-card/20" id="pricing">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-4xl font-bold mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your business. All plans include
            our core POS features, with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group rounded-3xl overflow-hidden shadow-lg border transition-all duration-500
                ${
                  plan.highlighted
                    ? "border-primary/50 bg-card transform scale-105"
                    : "border-border/50 bg-background"
                }
                hover:shadow-2xl hover:shadow-primary/10 hover:scale-105`}
            >
             
              <div
                className={`p-8 text-center border-b ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-foreground border-border"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2 tracking-tight">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-5xl font-bold">₨{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">/month</p>
                <p className={`text-sm mt-2 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  Perfect for {plan.name.toLowerCase()} businesses
                </p>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-sm font-medium">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>Products: {plan.products}</span>
                  </li>
                  <li className="flex items-center text-sm font-medium">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>Categories: {plan.categories}</span>
                  </li>
                  <li className="flex items-center text-sm font-medium">
                    <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>Members: {plan.members}</span>
                  </li>
                  <hr className="my-2 border-border" />
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm font-medium">
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full text-lg py-6 font-bold tracking-wide
                    ${
                      plan.highlighted
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                >
                  <a href="#contact" className="flex items-center justify-center">
                    Get Started <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Need a custom plan?{" "}
            <a href="#contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;