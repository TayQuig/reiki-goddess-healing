/**
 * CategoryFilter Component Types
 */

import type { BlogCategory } from "../types";

export interface CategoryFilterProps {
  /**
   * Currently selected category
   */
  selectedCategory: BlogCategory | "all";

  /**
   * Callback when category changes
   */
  onCategoryChange: (category: BlogCategory | "all") => void;

  /**
   * Optional post counts per category
   */
  postCounts?: Record<string, number>;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface CategoryOption {
  id: BlogCategory | "all";
  label: string;
  color: string;
}
