import { Button } from "@/components/ui/button";
import { Download, Play, ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/pos-hero-image.jpg";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "5,000",
      products: "Up to 100",
      categories: "Up to 10",
      members: "Up to 3",
      features: ["Products + Categories"],
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
        "Members management",
        "Basic reporting",
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
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="py-16 bg-[#1C3333]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F4F9F9] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-[#F4F9F9]/90 max-w-3xl mx-auto">
            Choose the plan that works best for your business. All plans include
            our core POS features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group rounded-xl overflow-hidden border ${
                plan.highlighted
                  ? "border-2 border-[#76B39D]"
                  : "border-[#2F4F4F]"
              } bg-[#2F4F4F] hover:shadow-feature hover:scale-105 transition-all duration-300`}
            >
              <div
                className={`p-6 ${
                  plan.highlighted
                    ? "bg-[#76B39D] text-[#1C3333]"
                    : "bg-[#355C5C] text-[#F4F9F9]"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-3">
                  <span className="text-3xl font-bold">₨{plan.price}</span>
                  <span className="ml-1 text-sm">/month</span>
                </div>
                <p className="text-xs">
                  Perfect for {plan.name.toLowerCase()} businesses
                </p>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6 text-[#F4F9F9]">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-[#76B39D] mr-2 flex-shrink-0" />
                    <span>Products: {plan.products}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-[#76B39D] mr-2 flex-shrink-0" />
                    <span>Categories: {plan.categories}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-[#76B39D] mr-2 flex-shrink-0" />
                    <span>Members: {plan.members}</span>
                  </li>
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-[#76B39D] mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full text-sm py-3 ${
                    plan.highlighted
                      ? "bg-[#76B39D] text-[#1C3333] hover:bg-[#68a18c]"
                      : "bg-[#1C3333] text-[#F4F9F9] hover:bg-[#142626]"
                  }`}
                >
                  <a href="#contact">Contact Us</a>{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#F4F9F9]/90 text-sm">
            Need a custom plan?{" "}
            <a href="#contact" className="text-[#76B39D] hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
