import { useState } from "react";
import {
  LineChartIcon as ChartLineUp,
  Brain,
  BotIcon as Robot,
  FileCheckIcon as FileReport,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-emerald-500" />, 
      title: "ML Model Integration",
      description:
        "Our advanced machine learning algorithms analyze vast amounts of data to predict carbon emissions with unprecedented accuracy. By integrating cutting-edge ML models, we provide you with insights that go beyond traditional analytics, helping you make informed decisions to reduce your carbon footprint effectively.",
      image: "ml.jpg",
      gap: "8rem", // Custom gap for this feature
      route: "/predictions", // Add navigation route
    },
    {
      icon: <Robot className="w-12 h-12 text-emerald-500" />,
      title: "Chat Bot & Gen AI",
      description:
        "Experience the power of conversational AI with our intelligent chatbot. Powered by state-of-the-art generative AI, our chatbot assists you in real-time with emission calculations, provides tailored recommendations, and answers your complex questions about carbon management. It's like having a carbon expert at your fingertips 24/7.",
      image: "ai.jpg",
      gap: "6rem", // Custom gap for this feature
      route: "/chatbot", // Add navigation route
    },
    {
      icon: <ChartLineUp className="w-12 h-12 text-emerald-500" />,
      title: "Environment Prediction",
      description:
        "Stay ahead of environmental changes with our predictive analytics. Our environment prediction feature uses historical data and advanced modeling to forecast future emission trends and potential environmental impacts. This foresight allows you to proactively adjust your strategies and minimize your ecological footprint.",
      image: "pre.jpg",
      gap: "10rem", // Custom gap for this feature
      route: "/predictions", // Add navigation route
    },
    {
      icon: <FileReport className="w-12 h-12 text-emerald-500" />,
      title: "Report Generation",
      description:
        "Transform complex data into clear, actionable insights with our automated report generation. Our system compiles comprehensive reports that not only show your current emission status but also provide detailed recommendations for reduction. These reports are invaluable for internal decision-making, stakeholder communication, and regulatory compliance.",
      image: "report.jpg",
      gap: "7rem", // Custom gap for this feature
      route: "/environmental-reports", // Add navigation route
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-emerald-500" />,
      title: "Neutrality Increment Points",
      description:
        "Gamify your journey to carbon neutrality with our unique point-based system. As you implement emission-reducing measures, you earn Neutrality Increment Points. These points provide a tangible metric of your progress, motivating your team and showcasing your commitment to sustainability to clients and partners alike.",
      image: "net.jpg",
      gap: "5rem", // Custom gap for this feature
      route: "/neutralityoptions", // Add navigation route
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Features Section */}
      <section id="features" className="py-20 bg-[#342F49]">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#66C5CC] mb-12 sm:mb-16">
            Our Features
          </h2>
          <div className="space-y-24 sm:space-y-32">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center justify-between`}
              >
                {/* Picture Div */}
                <div className="w-full lg:w-[45%] h-auto">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg border border-[#66C5CC]"
                  />
                </div>

                {/* Information Div */}
                <div className="w-full lg:w-[45%] space-y-6 sm:space-y-8 mt-10 lg:mt-0">
                  <div className="flex items-center gap-6 sm:gap-8">
                    {feature.icon}
                    <h3 className="text-3xl sm:text-4xl font-semibold text-[#66C5CC]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xl sm:text-2xl text-white leading-8 sm:leading-9">
                    {feature.description}
                  </p>
                  <button
                    className="bg-[#66C5CC] text-[#342F49] px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-md hover:bg-[#4da5aa] transition duration-300"
                    onClick={() => navigate(feature.route)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
