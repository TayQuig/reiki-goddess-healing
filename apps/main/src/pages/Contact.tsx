import {
  HeaderSection,
  FooterSection,
  ResponsiveContainer,
  SecureContactForm,
} from "@reiki-goddess/shared-components";

function Contact() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <HeaderSection />
      <ResponsiveContainer className="py-20">
        <h1 className="text-4xl font-bold text-[#0205B7] mb-8">Contact Us</h1>
        <SecureContactForm />
      </ResponsiveContainer>
      <FooterSection />
    </div>
  );
}

export default Contact;
