import {
  HeaderSection,
  FooterSection,
  ResponsiveContainer,
} from "@reiki-goddess/shared-components";

// Note: BLog folder contains duplicate of About page
// Using placeholder content until proper Blog component is created
function Blog() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <HeaderSection />
      <ResponsiveContainer className="py-20">
        <h1 className="text-4xl font-bold text-[#0205B7] mb-4">Blog</h1>
        <p className="text-gray-700">Blog content coming soon...</p>
      </ResponsiveContainer>
      <FooterSection />
    </div>
  );
}

export default Blog;
