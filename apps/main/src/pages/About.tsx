import PageTransition from "../components/PageTransition";

function About() {
  return (
    <PageTransition>
      <div data-testid="page-about" className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-[#0205B7] mb-4">
            About The Reiki Goddess
          </h1>
          <p className="text-gray-700">About page</p>
        </div>
      </div>
    </PageTransition>
  );
}

export default About;
