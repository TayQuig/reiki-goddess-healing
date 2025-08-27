import React from "react";
import { Link } from "react-router-dom";
import {
  HeaderSection,
  FooterSection,
  ResponsiveContainer,
} from "@reiki-goddess/shared-components";
import { businessData } from "@reiki-goddess/shared-utils";
import {
  createNavigationItems,
  footerSections,
  socialLinks,
  brandConfig,
  copyrightConfig,
} from "../utils/navigationData";

const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <HeaderSection
        navigationItems={createNavigationItems("/")}
        brand={brandConfig}
      />

      {/* Main Content */}
      <ResponsiveContainer variant="page" className="pt-24 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-[63.6px] font-bold text-black leading-normal [font-family:'Figtree',Helvetica]">
            The Reiki Goddess Healing
          </h1>

          <p className="text-base font-medium text-[#1c1b1b] max-w-2xl mx-auto leading-6 [font-family:'Figtree',Helvetica]">
            Experience transformative healing through Reiki energy work and
            sound therapy. Discover inner peace, release emotional blockages,
            and restore harmony to your body, mind, and spirit.
          </p>

          <div className="flex gap-[35px] justify-center">
            <Link
              to="/about"
              className="flex w-[184px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 rounded-[90px] bg-variable-collection-color-duplicate text-variable-collection-color-6-duplicate hover:bg-variable-collection-color-4 transition-colors [font-family:'Figtree',Helvetica] font-medium text-base tracking-[0] leading-6"
            >
              Learn More
              <div className="relative w-5 h-5">
                <svg
                  className="w-2.5 h-2.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </Link>
            <Link
              to="/contact"
              className="flex w-[137px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 rounded-[90px] border border-solid border-variable-collection-color-duplicate text-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate hover:text-variable-collection-color-6-duplicate transition-colors [font-family:'Figtree',Helvetica] font-medium text-base tracking-[0] leading-6"
            >
              Contact Us
              <div className="relative w-5 h-5">
                <svg
                  className="w-2.5 h-2.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Services Preview - Authentic Anima Card Styling */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="w-[322px] h-[156px] bg-white rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029] p-[25px] mx-auto">
            <div className="[font-family:'Figtree',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2">
              Reiki Healing
            </div>
            <p className="[font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-lg tracking-[0] leading-[23px]">
              Traditional energy healing for stress relief and balance.
            </p>
          </div>

          <div className="w-[322px] h-[156px] bg-[linear-gradient(122deg,rgba(2,5,183,1)_0%,rgba(99,213,249,1)_100%)] rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029] p-[25px] mx-auto">
            <div className="[font-family:'Figtree',Helvetica] font-bold text-variable-collection-color-6-duplicate text-lg tracking-[0] leading-[normal] mb-2">
              Sound Therapy
            </div>
            <p className="[font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-lg tracking-[0] leading-[23px]">
              Healing vibrations using therapeutic instruments.
            </p>
          </div>

          <div className="w-[322px] h-[156px] bg-white rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029] p-[25px] mx-auto">
            <div className="[font-family:'Figtree',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2">
              Holistic Wellness
            </div>
            <p className="[font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-lg tracking-[0] leading-[23px]">
              Comprehensive mind, body, and spirit healing.
            </p>
          </div>
        </div>
      </ResponsiveContainer>

      {/* Footer with Authentic Anima Styling */}
      <footer className="relative w-full h-[590px] bg-footer-gray">
        <div className="absolute w-[420px] h-[156px] top-[50px] left-[102px]">
          <img
            className="w-full h-full object-cover"
            alt="The Reiki Goddess Healing Logo"
            src="/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1-1.png"
          />
        </div>

        <p className="absolute w-[264px] top-52 left-[135px] [font-family:'Figtree',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px]">
          Professional Reiki healing services and wellness guidance for mind,
          body, and spirit transformation.
        </p>

        <div className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[599px]">
          <div className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
            Quick Links
          </div>
          <nav className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]">
            <Link
              to="/about"
              className="relative self-stretch [font-family:'Figtree',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="relative self-stretch [font-family:'Figtree',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity"
            >
              Contact
            </Link>
            <Link
              to="/blog"
              className="relative self-stretch [font-family:'Figtree',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity"
            >
              Blog
            </Link>
          </nav>
        </div>

        <div className="absolute w-[1325px] h-px top-[492px] left-[59px] bg-gray-200" />

        <p className="absolute top-[532px] left-[578px] [font-family:'Figtree',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px] whitespace-nowrap">
          © 2025 The Reiki Goddess Healing | All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export { SimpleHomePage };
