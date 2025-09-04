import React from "react";
import { ResponsiveContainer } from "../ResponsiveContainer/ResponsiveContainer";
import { SecureContactForm } from "../SecureContactForm";

/**
 * ContactPage - Contact page component (placeholder)
 * Will be migrated from legacy Contact/ directory
 */
export const ContactPage: React.FC = () => {
  return (
    <ResponsiveContainer className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600">
            Ready to begin your healing journey? Contact us to schedule your
            session or ask any questions about our services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">📍</div>
                <div>
                  <h3 className="font-medium text-gray-800">Location</h3>
                  <p className="text-gray-600">Roy, Washington</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">📞</div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">Available upon booking</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">✉️</div>
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">Available upon booking</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <p className="text-blue-700 font-medium">
                🚧 Contact form and details being migrated from legacy Contact
                section.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send a Message
            </h2>
            <SecureContactForm 
              onSubmit={async (data) => {
                // TODO: Implement actual form submission
                console.log('Contact form submitted:', data);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
              }}
            />
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};
