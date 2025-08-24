import React from "react";

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  logo?: {
    src: string;
    alt: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({ items, logo }) => {
  return (
    <header className="absolute w-full h-[93px] top-0 left-0 rounded-[9px] overflow-hidden">
      <nav className="absolute w-[716px] h-[19px] top-[37px] right-[65px]">
        <div className="inline-flex items-center gap-[84px] relative">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-semibold text-variable-collection-color-duplicate text-base tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {logo && (
        <img
          className="absolute w-[248px] h-[92px] top-px left-[49px] aspect-[2.7] object-cover"
          alt={logo.alt}
          src={logo.src}
        />
      )}
    </header>
  );
};

export default Navigation;