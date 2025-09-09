import React from "react";
import { CallToActionSection } from "./sections/CallToActionSection/CallToActionSection";
import { ContactFormSection } from "./sections/ContactFormSection";
import { EmailInfoSection } from "./sections/EmailInfoSection";
import { FooterSection } from "./sections/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { LocationInfoSection } from "./sections/LocationInfoSection/LocationInfoSection";
import { PhoneInfoSection } from "./sections/PhoneInfoSection";

export const Contact = (): JSX.Element => {
  const contactInfo = [
    {
      id: "location",
      title: "Our Location",
      icon: "/img/vector-1.svg",
      iconAlt: "Location icon",
      content: "Roy, Washington",
      actionText: "Get Directions",
      actionIcon: "/img/vector-5.svg",
    },
    {
      id: "phone",
      title: "Our Phone",
      icon: "/img/call.png",
      iconAlt: "Phone icon",
      content: "0300 0000 0000",
      actionText: "Call Us",
      actionIcon: "/img/vector-5.svg",
    },
    {
      id: "email",
      title: "Our Email",
      icon: "/img/vector-3.svg",
      iconAlt: "Email icon",
      content: "thereikigoddesshealing@gmail.com",
      actionText: "Email Us",
      actionIcon: "/img/vector-5.svg",
    },
  ];

  return (
    <div
      className="bg-[#fffcf6] grid justify-items-center [align-items:start] w-screen"
      data-model-id="2021:1178"
    >
      <div className="bg-[#fffcf6] w-[1440px] h-[3114px] relative">
        <HeaderSection />

        <div className="absolute top-48 left-[535px] [font-family:'Figtree',Helvetica] font-bold text-black text-[63.6px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          Get in Touch
        </div>

        <p className="absolute top-[284px] left-[497px] [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-base text-center tracking-[0] leading-6 whitespace-nowrap">
          Have questions or want to book a session? We&apos;re here to help.
        </p>

        <div className="absolute w-[1440px] h-[1226px] top-[698px] left-0">
          <div className="absolute w-[1440px] h-[1226px] top-0 left-0">
            <img
              className="w-[570px] top-[51px] left-[870px] absolute h-[808px] aspect-[1] object-cover"
              alt="Img"
              src="/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-3.png"
            />

            <img
              className="w-[628px] top-[94px] left-0 absolute h-[808px] aspect-[1] object-cover"
              alt="Img"
              src="/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-4.png"
            />

            {contactInfo.map((info, index) => {
              const leftPositions = ["201px", "559px", "917px"];
              return (
                <div
                  key={info.id}
                  className="absolute w-[322px] h-[156px] top-[418px] bg-white rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029]"
                  style={{ left: leftPositions[index] }}
                >
                  <div className="top-[25px] absolute left-[25px] [font-family:'Figtree',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                    {info.title}
                  </div>

                  <div className="inline-flex items-center gap-3 absolute top-[63px] left-[25px]">
                    {info.id === "location" && (
                      <div className="relative w-6 h-6 aspect-[1]">
                        <img
                          className="absolute w-3.5 h-5 top-0.5 left-[5px]"
                          alt={info.iconAlt}
                          src={info.icon}
                        />
                      </div>
                    )}

                    {info.id === "phone" && (
                      <div className="relative w-6 h-6 aspect-[1] bg-[url(/img/call.png)] bg-[100%_100%]" />
                    )}

                    {info.id === "email" && (
                      <div className="relative w-6 h-6 aspect-[1]">
                        <img
                          className="absolute w-5 h-4 top-1 left-0.5"
                          alt={info.iconAlt}
                          src={info.icon}
                        />
                      </div>
                    )}

                    <div className="relative w-fit [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] whitespace-nowrap">
                      {info.content}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2.5 absolute top-[113px] left-[25px]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
                      {info.actionText}
                    </div>

                    <div className="relative w-5 h-5 aspect-[1]">
                      <img
                        className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                        alt="Arrow"
                        src={info.actionIcon}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <CallToActionSection />

            <div className="inline-flex items-center gap-4 absolute top-[200px] left-[98px]">
              <img
                className="relative w-6 h-6 aspect-[1]"
                alt="Check box outline"
                src="/img/check-box-outline-blank.png"
              />

              <p className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-[#5f5f5f] text-base tracking-[0] leading-6 whitespace-nowrap">
                I have read and agree to the Terms &amp; Conditions
              </p>
            </div>

            <img
              className="absolute w-[1440px] h-[598px] top-[628px] left-0"
              alt="Rectangle"
              src="/img/rectangle-38.png"
            />
          </div>

          <div className="flex w-[169px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 absolute top-[274px] left-[635px] rounded-[90px] border border-solid border-variable-collection-color-duplicate">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
              Submit
            </div>
          </div>
        </div>

        <ContactFormSection />
        <PhoneInfoSection />
        <EmailInfoSection />
        <LocationInfoSection />
        <FooterSection />
      </div>
    </div>
  );
};
