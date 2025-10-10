/**
 * BlogSearch Component
 *
 * Search bar for filtering blog posts by keywords.
 * Features a centered search input with icon matching Figma design.
 */

import React from "react";
import type { BlogSearchProps } from "./BlogSearch.types";

export const BlogSearch: React.FC<BlogSearchProps> = ({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`flex justify-center py-8 ${className}`}
      style={{ padding: "32px 66px" }}
    >
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="
            w-full px-6 py-3 pr-12
            text-base
            bg-white
            border border-gray-300
            rounded-full
            focus:outline-none focus:ring-2 focus:ring-[#0205B7] focus:border-transparent
            transition-all duration-200
          "
          style={{
            fontFamily: "Figtree, sans-serif",
            color: "#333333",
          }}
          aria-label="Search blog posts"
        />
        <button
          type="button"
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            w-10 h-10
            flex items-center justify-center
            bg-[#333333]
            rounded-full
            hover:bg-[#0205B7]
            transition-colors duration-200
          "
          aria-label="Submit search"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
