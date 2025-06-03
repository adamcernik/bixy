"use client";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-blue-800">Professional Bike Services</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          <span className="font-semibold">Over 10 Years of Trusted Expertise</span><br />
          For more than a decade, I've been helping cyclists navigate the world of electric bikes. Dozens of satisfied customers have relied on my expertise to find their perfect ride, and many continue to call me whenever they need guidance or support. My passion for Bulls bikes and commitment to exceptional service has built a reputation for reliability and expertise in the ebike community.
        </p>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Our Services</h2>
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Bike Consultation & Selection</h3>
            <p className="text-gray-700 mb-2 font-semibold">Find Your Perfect Match</p>
            <p className="text-gray-700">Choosing the right bike can be overwhelming with so many options available. While I specialize in ebikes and have extensive knowledge of the Bulls lineup, I also help customers with traditional bicycles when needed. I work personally with each customer to understand your riding style, needs, and budget, helping you find the ideal bike and secure it at a reasonable price that fits your budget.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Professional Setup & Configuration</h3>
            <p className="text-gray-700 mb-2 font-semibold">Ready to Ride Right Away</p>
            <p className="text-gray-700">Getting your new ebike properly set up is crucial for comfort, safety, and performance. I handle complete bike assembly, adjustment, and fine-tuning to ensure everything is perfectly calibrated for your body and riding preferences.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Accessories & Equipment Consultation</h3>
            <p className="text-gray-700 mb-2 font-semibold">Complete Your Setup</p>
            <p className="text-gray-700">The right accessories make all the difference in your ebike experience. From helmets and locks to bags and lighting systems, I'll help you choose accessories that enhance your riding while staying within your budget.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Home-Based Repair & Maintenance</h3>
            <p className="text-gray-700 mb-2 font-semibold">Convenient, Personal Service</p>
            <p className="text-gray-700">Operating from my dedicated home workshop, I provide personalized repair and maintenance services for both electric and traditional bicycles in a comfortable, relaxed environment. While my specialty is ebikes, I'm happy to service conventional bikes as well. This setup allows me to give each bike the individual attention it deserves while keeping overhead low and passing those savings to you.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Advanced Ebike Diagnostics</h3>
            <p className="text-gray-700 mb-2 font-semibold">Cutting-Edge Problem Solving</p>
            <p className="text-gray-700">Modern ebikes are sophisticated machines that require specialized diagnostic equipment. My workshop is equipped with professional ebike diagnostic tools to quickly identify electrical issues, motor problems, battery concerns, and system malfunctions that traditional bike shops might miss.</p>
          </section>
          <section className="bg-gray-50 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-blue-700">Warranty & Guarantee Management</h3>
            <p className="text-gray-700 mb-2 font-semibold">Hassle-Free Warranty Support</p>
            <p className="text-gray-700">When warranty issues arise, I handle the entire process for you. Whether it's a repair I can complete in my workshop or a situation requiring manufacturer involvement, I manage all communication and coordination to get your bike back to perfect condition with minimal hassle on your part.</p>
          </section>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-800 font-semibold">Need Help?</p>
          <p className="text-gray-700">Just like dozens of customers before you, don't hesitate to call when you need expert advice or professional service. I'm here to keep you riding with confidence.</p>
        </div>
      </div>
    </main>
  );
} 