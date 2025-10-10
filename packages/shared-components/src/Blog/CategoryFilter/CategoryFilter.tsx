/**
 * CategoryFilter Component
 *
 * Filter pills for blog category selection with active state styling.
 * Features sticky positioning at top: 93px (below header) with responsive horizontal scrolling.
 *
 * Design Specifications:
 * - Sticky positioning: top-[93px], z-index 40
 * - Background: cream (#FFFBF5) with border
 * - Pills: brand blue (#0205B7) borders and active state
 * - Hover: 0.3s transition with bg-[#0205B7]/10
 * - Typography: 16px desktop (text-base), 14px mobile (text-sm), weight 500
 * - Padding: 24px vertical desktop, 16px mobile; 24px horizontal pills desktop, 16px mobile
 * - Scrolling: horizontal on mobile with scrollbar-hide
 * - Accessibility: role="tablist", aria-selected, keyboard navigation
 */

import React from "react";
import type {
  CategoryFilterProps,
  CategoryOption,
} from "./CategoryFilter.types";

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All Posts", color: "#0205B7" },
  { id: "healing", label: "Healing", color: "#0205B7" },
  { id: "wellness", label: "Wellness", color: "#A593E0" },
  { id: "events", label: "Events", color: "#FFC6A5" },
  { id: "stories", label: "Stories", color: "#63D5F9" },
  { id: "meditation", label: "Meditation", color: "#A593E0" },
  { id: "chakras", label: "Chakras", color: "#FFC6A5" },
  { id: "testimonials", label: "Testimonials", color: "#63D5F9" },
  { id: "news", label: "News", color: "#0205B7" },
  { id: "guides", label: "Guides", color: "#A593E0" },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  postCounts,
  className = "",
}) => {
  return (
    <nav
      aria-label="Blog category filters"
      className={`
        sticky top-[93px] z-40
        bg-[#FFFBF5] border-b border-[#0205B7]/10
        py-4 px-5
        md:py-6 md:px-[66px]
        ${className}
      `}
    >
      <div
        role="tablist"
        aria-controls="blog-posts-grid"
        className="
          flex gap-3
          overflow-x-auto
          scrollbar-hide
        "
      >
        {DEFAULT_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          const count = postCounts?.[category.id];

          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              aria-controls="blog-posts-grid"
              onClick={() => onCategoryChange(category.id)}
              className={`
                px-4 py-2
                md:px-6 md:py-2.5
                min-h-[44px]
                rounded-full
                text-sm md:text-base
                font-medium
                border-2
                transition-all duration-300 ease-in-out
                whitespace-nowrap flex-shrink-0
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0205B7]
                active:scale-95
                ${
                  isActive
                    ? "bg-[#0205B7] text-white border-[#0205B7]"
                    : "bg-transparent text-[#0205B7] border-[#0205B7] hover:bg-[#0205B7]/10"
                }
              `}
            >
              {category.label}
              {typeof count === "number" && ` (${count})`}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
