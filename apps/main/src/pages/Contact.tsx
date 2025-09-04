import { SecureContactForm } from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";

function Contact() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-[#0205B7] mb-8">Contact Us</h1>
          <SecureContactForm 
            onSubmit={async (data) => {
              // TODO: Implement actual form submission
              console.log('Contact form submitted:', data);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }}
          />
        </div>
      </div>
    </PageTransition>
  );
}

export default Contact;
