import React from "react";

export const FooterSection = (): JSX.Element => {
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer
      className="absolute w-[1440px] h-[93px] top-0 left-0 rounded-[9px] overflow-hidden"
      role="contentinfo"
    >
      <nav
        className="absolute w-[716px] h-[19px] top-[37px] left-[623px]"
        aria-label="Footer navigation"
      >
        <ul className="inline-flex items-center gap-[84px] relative">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-semibold text-variable-collection-color-duplicate text-base tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-80 focus:outline-2 focus:outline-variable-collection-color-duplicate focus:outline-offset-2"
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <img
        className="absolute w-[248px] h-[92px] top-px left-[49px] aspect-[2.7] object-cover"
        alt="The Reiki Goddess logo"
        src="/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1.png"
      />
    </footer>
  );
};
