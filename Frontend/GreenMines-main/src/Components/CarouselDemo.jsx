export default function CarouselDemo() {
  return (
    <div className="w-full min-h-screen bg-[#342F49]">
  {/* Hero Section Start */}
  <div className="flex flex-col md:flex-row items-center gap-4 mb-24 px-8 py-16">
  <div className="md:w-1/2">
  <h1 className="text-5xl md:text-6xl font-bold text-[#66C5CC] mb-8">
    Teamwork: The Core of GreenMines
  </h1>
  <p className="text-white text-xl md:text-2xl">
    At GreenMines, our success is built on collaboration. Our dedicated team, Quantum Quorum, combines diverse expertise and innovation to tackle the challenges of sustainable mining and create impactful solutions together.
  </p>
</div>

    <div className="md:w-1/2">
      <img 
        src="climb.jpg" 
        alt="GreenMines Hero Illustration" 
        className="w-full border border-[#66C5CC] rounded-lg"
      />
    </div>
  </div>
  {/* Hero Section End */}

  {/* Latest News Section Start */}
<div className="mb-28 px-8">
  <h2 className="text-4xl font-bold text-[#66C5CC] mb-12">Latest Updates</h2>
  <div className="grid md:grid-cols-3 gap-12">
    <div className="bg-[#342F49] p-10 rounded-lg shadow-lg border border-[#66C5CC]">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-base text-[#66C5CC]">SIH 2024</span>
        <span className="text-white">+</span>
        <span className="text-base text-[#66C5CC]">GreenMines</span>
      </div>
      <p className="text-lg text-white">
        Our project, GreenMines, is driving change in sustainable mining and has proudly secured a spot in the **Smart India Hackathon 2024 Senior Grand Finale**.
      </p>
    </div>
    <div className="bg-[#342F49] p-10 rounded-lg shadow-lg border border-[#66C5CC]">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-base text-[#66C5CC]">Green Initiatives</span>
        <span className="text-white">+</span>
        <span className="text-base text-[#66C5CC]">Carbon Neutrality</span>
      </div>
      <p className="text-lg text-white">
        We’re exploring innovative AI-based solutions to help coal mines achieve carbon neutrality and minimize environmental impact.
      </p>
    </div>
    <div className="bg-[#342F49] p-10 rounded-lg shadow-lg border border-[#66C5CC]">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-base text-[#66C5CC]">Teamwork</span>
        <span className="text-white">+</span>
        <span className="text-base text-[#66C5CC]">Sustainability</span>
      </div>
      <p className="text-lg text-white">
        Our team, **Quantum Quorum**, is dedicated to driving sustainability in mining with innovative tools and a mission for change.
      </p>
    </div>
  </div>
</div>
{/* Latest News Section End */}

{/* How It Works Section Start */}
<div className="px-10 py-5">
  <h2 className="text-4xl font-bold text-center text-[#66C5CC] mb-12">
    Simplifying the Path to Carbon Neutrality in Four Steps
  </h2>
  <div className="grid md:grid-cols-4 gap-16 mt-12">
    <div className="text-center">
      <div className="w-16 h-16 bg-[#66C5CC] rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-[#342F49] text-xl font-bold">1</span>
      </div>
      <h3 className="font-semibold text-white mb-4 text-xl">Data Collection</h3>
      <p className="text-base text-white">
        Gather comprehensive data on emissions and environmental factors from coal mines.
      </p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-[#66C5CC] rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-[#342F49] text-xl font-bold">2</span>
      </div>
      <h3 className="font-semibold text-white mb-4 text-xl">Impact Analysis</h3>
      <p className="text-base text-white">
        Use AI-powered tools to analyze the carbon footprint and environmental impact of operations.
      </p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-[#66C5CC] rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-[#342F49] text-xl font-bold">3</span>
      </div>
      <h3 className="font-semibold text-white mb-4 text-xl">Actionable Insights</h3>
      <p className="text-base text-white">
        Generate actionable reports with recommendations for reducing emissions and transitioning to greener processes.
      </p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-[#66C5CC] rounded-full flex items-center justify-center mx-auto mb-8">
        <span className="text-[#342F49] text-xl font-bold">4</span>
      </div>
      <h3 className="font-semibold text-white mb-4 text-xl">Track Progress</h3>
      <p className="text-base text-white">
        Monitor changes over time and refine strategies to meet carbon neutrality goals effectively.
      </p>
    </div>
  </div>
</div>
{/* How It Works Section End */}

</div>

  )
}

