import React, { useState } from "react";
import DateRangeForm from "./DateRangeForm";
import EmissionsResult from "./EmissionsResult";
import Navbar from "./Navbar"
import ChatAssistant from "./ChatAssistant";

function EmissionsAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
  };

  return (
    <div className="min-h-screen bg-[#342F49] text-white p-3">
      <Navbar />
      <ChatAssistant />
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#66C5CC]">Emissions Impact Analyzer</h1>
      <div className="space-y-12 ">
        <DateRangeForm onAnalysisComplete={handleAnalysisComplete} />
        {analysisResult && <EmissionsResult result={analysisResult} />}
      </div>
    </div>
  </div>
  );
}

export default EmissionsAnalysisPage;
