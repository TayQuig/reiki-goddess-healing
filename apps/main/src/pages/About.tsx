import {
  HeaderSection,
  FooterSection,
  ResponsiveContainer,
} from "@reiki-goddess/shared-components";

function About() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <HeaderSection />
      <ResponsiveContainer className="py-20">
        <h1 className="text-4xl font-bold text-[#0205B7] mb-4">
          About The Reiki Goddess
        </h1>
        <p className="text-gray-700">About page content coming soon...</p>
      </ResponsiveContainer>
      <FooterSection />
    </div>
  );
}

export default About;
