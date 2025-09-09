import React from "react";

export const LocationInfoSection = (): JSX.Element => {
  const quickLinksData = [
    { label: "Services", href: "/services" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinksData = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Disclaimer", href: "/disclaimer" },
  ];

  return (
    <section className="flex flex-col w-[1440px] items-center gap-[161px] absolute top-[2098px] left-0">
      <div className="relative w-[1095px] h-[265px] rounded-[20px] overflow-hidden shadow-[9px_10px_0px_#63d5f9] bg-[url(/img/frame-33.png)] bg-cover bg-[50%_50%] bg-variable-collection-color-duplicate">
        <div className="relative w-[1049px] h-[213px] top-[26px] left-[23px]">
          <div className="absolute w-[1049px] h-[213px] top-0 left-0">
            <div className="top-0 left-0 absolute w-4 h-4 bg-white rounded-lg" />
            <div className="top-0 left-[1033px] absolute w-4 h-4 bg-white rounded-lg" />
            <div className="top-[197px] left-[1033px] absolute w-4 h-4 bg-white rounded-lg" />
            <div className="top-[197px] left-0 absolute w-4 h-4 bg-white rounded-lg" />
          </div>

          <h2 className="absolute top-[37px] left-[103px] [font-family:'Figtree',Helvetica] font-bold text-white text-5xl text-center tracking-[0] leading-[normal]">
            Ready to Begin Your Healing Journey?
          </h2>

          <button
            className="inline-flex items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 absolute top-[145px] left-[408px] rounded-[90px] border border-solid border-variable-collection-color-6-duplicate hover:bg-white hover:text-variable-collection-color-duplicate transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-variable-collection-color-duplicate"
            aria-label="Book Your Session Today"
          >
            <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
              Book Your Session Today
            </span>
            <div className="relative w-5 h-5 aspect-[1]" aria-hidden="true">
              <img
                className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                alt=""
                src="/img/vector.svg"
              />
            </div>
          </button>
        </div>
      </div>

      <footer className="relative self-stretch w-full h-[590px] bg-[#f7f7f7]">
        <p className="absolute w-[264px] top-52 left-[135px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px]">
          Creating beautiful, functional websites for small businesses.
        </p>

        <div className="flex flex-col w-[142px] items-start gap-6 absolute top-[92px] left-[1145px]">
          <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
            Follow us
          </h3>
          <div
            className="relative flex-[0_0_auto] mr-[-2.00px]"
            role="list"
            aria-label="Social media links"
          >
            <img
              className=""
              alt="Social media icons"
              src="/img/frame-2085660578.svg"
            />
          </div>
        </div>

        <nav
          className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[599px]"
          aria-label="Quick navigation links"
        >
          <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
            Quick Links
          </h3>
          <ul
            className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]"
            role="list"
          >
            {quickLinksData.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:text-variable-collection-color-duplicate transition-colors duration-200 focus:outline-none focus:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[872px]"
          aria-label="Legal information links"
        >
          <h3 className="mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-xl relative self-stretch text-black tracking-[0] leading-[normal]">
            Legal
          </h3>
          <ul
            className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]"
            role="list"
          >
            {legalLinksData.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className={`relative ${index < 2 ? "w-fit whitespace-nowrap" : "self-stretch"} ${index === 0 ? "mt-[-1.00px] mr-[-18.00px]" : index === 1 ? "mr-[-56.00px]" : ""} [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:text-variable-collection-color-duplicate transition-colors duration-200 focus:outline-none focus:underline`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <hr className="absolute w-[1325px] h-px top-[492px] left-[59px] border-0 bg-gray-300" />

        <p className="absolute top-[532px] left-[578px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px] whitespace-nowrap">
          © 2025 Thereikigoddess | All Rights Reserved.
        </p>

        <img
          className="absolute w-[420px] h-[156px] top-[50px] left-[102px] aspect-[2.7] object-cover"
          alt="The Reiki Goddess logo"
          src="/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1-1.png"
        />
      </footer>
    </section>
  );
};
