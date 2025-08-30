import { SecureContactForm } from "@reiki-goddess/shared-components";

function Contact() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-[#0205B7] mb-8">Contact Us</h1>
        <SecureContactForm />
      </div>
    </div>
  );
}

export default Contact;
