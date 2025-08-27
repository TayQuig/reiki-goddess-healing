import React from "react";

export interface FooterProps {
  quickLinks?: string[];
  legalLinks?: string[];
  logo?: {
    src: string;
    alt: string;
  };
  socialMedia?: {
    src: string;
    alt: string;
  };
}

const Footer: React.FC<FooterProps> = ({
  quickLinks = [],
  legalLinks = [],
  logo,
  socialMedia,
}) => {
  return (
    <footer className="relative w-full h-[590px] bg-[#f7f7f7]">
      <p className="absolute w-[264px] top-52 left-[135px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px]">
        Creating beautiful, functional websites for small businesses.
      </p>

      {socialMedia && (
        <div className="flex flex-col w-[142px] items-start gap-6 absolute top-[92px] left-[1145px]">
          <div className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
            Follow us
          </div>
          <img
            className="relative flex-[0_0_auto] mr-[-2.00px]"
            alt={socialMedia.alt}
            src={socialMedia.src}
          />
        </div>
      )}

      {quickLinks.length > 0 && (
        <div className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[599px]">
          <div className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
            Quick Links
          </div>
          <nav className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="relative self-stretch [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      )}

      {legalLinks.length > 0 && (
        <div className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[872px]">
          <div className="mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-xl relative self-stretch text-black tracking-[0] leading-[normal]">
            Legal
          </div>
          <nav className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className={`relative ${
                  index < 2 ? "w-fit whitespace-nowrap" : "self-stretch"
                } [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity`}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div className="absolute w-[1325px] h-px top-[492px] left-[59px] bg-gray-200" />

      <p className="absolute top-[532px] left-[578px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px] whitespace-nowrap">
        © 2025 Thereikigoddess | All Rights Reserved.
      </p>

      {logo && (
        <img
          className="absolute w-[420px] h-[156px] top-[50px] left-[102px] aspect-[2.7] object-cover"
          alt={logo.alt}
          src={logo.src}
        />
      )}
    </footer>
  );
};

export default Footer;
