'use client';

import ChatAssistant from "./ChatAssistant";
import Enavbar from "./Enavbar";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { TreesIcon as Tree, Sun, Cloud, Leaf } from 'lucide-react';


export default function CarbonNeutralityOptions() {
  const options = [
    {
      icon: <Tree className="w-12 h-12 text-[#66C5CC]" />,
      title: "Carbon Sink",
      description: "Natural or artificial reservoirs that absorb and store carbon dioxide from the atmosphere.",
      effectiveness: 75,
      impact: 2500,
      detailsUrl: "/neutrality",
    },
    {
      icon: <Sun className="w-12 h-12 text-[#66C5CC]" />,
      title: "Renewable Energy",
      description: "Transition to renewable energy sources such as solar, wind, and hydroelectric power.",
      effectiveness: 85,
      impact: 3000,
      detailsUrl: "/renewable",
    },
    {
      icon: <Cloud className="w-12 h-12 text-[#66C5CC]" />,
      title: "Carbon Capture and Storage",
      description: "Technology that captures CO2 emissions from industrial processes and stores them underground.",
      effectiveness: 70,
      impact: 2000,
      detailsUrl: "/CCS",
    },
    {
      icon: <Leaf className="w-12 h-12 text-[#66C5CC]" />,
      title: "AFOLU Impact",
      description: "Agriculture, Forestry, and Other Land Use practices to reduce emissions and enhance carbon sequestration.",
      effectiveness: 65,
      impact: 1800,
      detailsUrl: "/afolu",
    },
    {
      icon: <Cloud className="w-12 h-12 text-[#66C5CC]" />,
      title: "Emissions Impact Analyzer",
      description: "Agriculture, Forestry, and Other Land Use practices to reduce emissions and enhance carbon sequestration.",
      effectiveness: 48,
      impact: 1800,
      detailsUrl: "/emissions-analysis",
    },
    {
      icon: <Tree className="w-12 h-12 text-[#66C5CC]" />,
      title: "EV Fuel Saver",
      description: "FuelSave EV Optimizer calculates fuel savings and cost reductions when switching to electric vehicles. It analyzes fuel consumption, distance, and EV efficiency, offering insights into economic and environmental benefits for sustainable transportation..",
      effectiveness: 65,
      impact: 1800,
      detailsUrl: "/ev",
    },
    {
      icon: <Cloud className="w-12 h-12 text-[#66C5CC]" />,
      title: "MCS",
      description: "The MCS (Methane Conversion and Sequestration) Calculator estimates the conversion and sequestration of methane emissions to minimize their environmental impact and achieve sustainability goals.",
      effectiveness: 48,
      impact: 1800,
      detailsUrl: "/MCS",
    },
  ];

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-b from-[#342F49] to-[#1F1B2E]">
      <Enavbar />
      <ChatAssistant />
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 mb-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#66C5CC]">
          Carbon Neutrality Options
        </h1>
        <div className="space-y-24 sm:space-y-32 mt-12">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center justify-between`}
            >
              {/* Picture Div */}
              <div className="w-full lg:w-[45%] h-auto">
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-[#231E3D] rounded-lg shadow-lg border-2 border-[#66C5CC] flex items-center justify-center">
                  {option.icon}
                </div>
              </div>

              {/* Information Div */}
              <div className="w-full lg:w-[45%] space-y-6 sm:space-y-8 mt-10 lg:mt-0">
                <div className="flex items-center gap-6 sm:gap-8">
                  {option.icon}
                  <h3 className="text-3xl sm:text-4xl font-semibold text-[#66C5CC]">
                    {option.title}
                  </h3>
                </div>
                <p className="text-xl sm:text-2xl text-white leading-8 sm:leading-9">
                  {option.description}
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-[#66C5CC]">Effectiveness:</p>
                  <div className="w-full bg-[#342F49] rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${option.effectiveness}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#4da5aa]">
                    Annual CO2 Impact: {option.impact.toLocaleString()} million tonnes
                  </p>
                </div>
                <a
                  href={option.detailsUrl}
                  className="inline-block bg-[#66C5CC] text-[#231E3D] px-8 sm:px-10 py-3 sm:py-4 rounded-md text-base sm:text-lg font-semibold hover:bg-[#4da5aa] transition duration-300"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}