/**
 * CategoryFilter Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFilter } from "./CategoryFilter";

describe("CategoryFilter", () => {
  const mockOnCategoryChange = vi.fn();

  const defaultProps = {
    selectedCategory: "all" as const,
    onCategoryChange: mockOnCategoryChange,
  };

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  describe("Rendering", () => {
    it("renders all category options", () => {
      render(<CategoryFilter {...defaultProps} />);

      expect(
        screen.getByRole("tab", { name: /All Posts/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Healing/ })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Wellness/ })).toBeInTheDocument();
    });

    it("shows post counts when provided", () => {
      const postCounts = {
        all: 10,
        healing: 5,
        wellness: 3,
      };

      render(<CategoryFilter {...defaultProps} postCounts={postCounts} />);

      expect(
        screen.getByRole("tab", { name: /All Posts \(10\)/ })
      ).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("calls onCategoryChange when category is clicked", () => {
      render(<CategoryFilter {...defaultProps} />);

      const healingButton = screen.getByRole("tab", { name: /Healing/ });
      fireEvent.click(healingButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith("healing");
    });
  });

  describe("Accessibility", () => {
    it("has proper navigation role", () => {
      render(<CategoryFilter {...defaultProps} />);

      const nav = screen.getByRole("navigation", {
        name: /Blog category filters/,
      });
      expect(nav).toBeInTheDocument();
    });

    it("uses tab role for category buttons", () => {
      render(<CategoryFilter {...defaultProps} />);

      const buttons = screen.getAllByRole("tab");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
