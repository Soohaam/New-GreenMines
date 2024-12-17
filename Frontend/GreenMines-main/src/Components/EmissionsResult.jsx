import React from "react";

// Function to parse the emission data and number the points for each section
const parseEmissionsData = (text) => {
  // Split the response into sections by titles (marked with stars **)
  const emissionSections = text.split(/(?=\*\*.*\*\*)/);

  return emissionSections.map((section) => {
    // Split into title and points
    const [title, ...points] = section
      .split("\n")
      .map((line) => line.trim().replace(/\*\*/g, "")) // Remove stars (**)
      .filter((line) => line); // Remove empty lines

    // Process points into bold and non-bold parts
    const parsedPoints = points.map((point) => {
      const boldParts = [];
      const nonBoldParts = [];
      let isBold = false;
      let temp = "";

      // Iterate through each character to separate bold and non-bold text
      for (let char of point) {
        if (char === "*" && !isBold) {
          if (temp) nonBoldParts.push(temp);
          temp = "";
          isBold = true; // Start bold
        } else if (char === "*" && isBold) {
          boldParts.push(temp);
          temp = "";
          isBold = false; // End bold
        } else {
          temp += char;
        }
      }
      if (temp) (isBold ? boldParts : nonBoldParts).push(temp);

      return { boldParts, nonBoldParts, fullText: point }; // Store full text for logic checking
    });

    return {
      title,
      points: parsedPoints,
    };
  });
};

// Function to apply semi-bold style to text enclosed in - and :
const applySemiBoldStyle = (text) => {
  return text.replace(/(-.*?:)/g, (match) => {

    return `<span class="font-semibold text-[#20B2AA] hover:text-[#39FFD7]">${match}</span>`;
  });
};

function EmissionsResult({ result }) {
  const emissionsData = parseEmissionsData(result.aiAnalysis);

  return (
    <div className="w-full mx-auto mt-12 p-8 bg-[#231E3D] shadow-lg rounded-xl border border-[#66C5CC]">
    <h3 className="text-4xl font-bold mb-8 text-[#66C5CC] border-b border-[#66C5CC] pb-4">
      Emissions Impact Analysis
    </h3>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {emissionsData.map((item, sectionIndex) => (
        <div
          key={sectionIndex}
          className="p-6 bg-[#5f538a8f] rounded-lg shadow-md transition duration-300 hover:shadow-xl border border-[#66C5CC]"
        >
          <h4 className="text-2xl font-bold mb-4 text-[#66C5CC] border-b border-[#66C5CC] pb-2">
            {item.title}
          </h4>

          <div className="space-y-4">
            {item.points.map((point, pointIndex) => (
              <div key={pointIndex} className="flex items-start space-x-2">
                <span className="font-bold text-[#66C5CC] min-w-[2rem] text-xl">{pointIndex + 1}.</span>
                <div>
                  {point.boldParts.map((boldText, boldIndex) => (
                    <span
                      key={boldIndex}
                      className="inline-block py-1 px-2 rounded text-[#39FF14] font-bold text-xl mr-1 mb-1"
                    >
                      {boldText}
                    </span>
                  ))}
                  {point.nonBoldParts.map((text, textIndex) => (
                    <span
                      key={textIndex}
                      className="text-white text-xl font-bold"
                      dangerouslySetInnerHTML={{
                        __html: applySemiBoldStyle(text),
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default EmissionsResult;
