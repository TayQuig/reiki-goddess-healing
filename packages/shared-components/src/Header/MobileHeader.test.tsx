import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileHeader } from "./MobileHeader";
import { RouterWrapper } from "../test-utils";

// Custom render function that includes Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<RouterWrapper>{component}</RouterWrapper>);
};

describe("MobileHeader Component", () => {
  const defaultProps = {
    logo: {
      src: "/img/test-logo.png",
      alt: "Test Logo",
    },
    navigationItems: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  };

  describe("Rendering", () => {
    it("should render header bar with logo", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const logo = screen.getByAltText("Test Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass("h-12");
    });

    it("should render hamburger menu button", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("should not show menu initially", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Menu items should not be visible initially
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("translate-x-full");
    });
  });

  describe("Menu Interactions", () => {
    it("should toggle menu on hamburger click", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      const nav = screen.getByRole("navigation");

      // Initially closed
      expect(nav).toHaveClass("translate-x-full");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");

      // Click to open
      await act(async () => {
        await user.click(menuButton);
      });
      expect(nav).toHaveClass("translate-x-0");
      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      // Click to close
      await act(async () => {
        await user.click(menuButton);
      });
      expect(nav).toHaveClass("translate-x-full");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("should animate hamburger icon on toggle", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      const spans = menuButton.querySelectorAll("span");

      // Initial state
      expect(spans[0]).not.toHaveClass("rotate-45");
      expect(spans[1]).not.toHaveClass("opacity-0");
      expect(spans[2]).not.toHaveClass("-rotate-45");

      // After opening
      await act(async () => {
        await user.click(menuButton);
      });
      expect(spans[0]).toHaveClass("rotate-45");
      expect(spans[1]).toHaveClass("opacity-0");
      expect(spans[2]).toHaveClass("-rotate-45");
    });

    it("should close menu when clicking overlay", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });

      // Open menu
      await act(async () => {
        await user.click(menuButton);
      });

      // Click overlay (the dark background)
      const overlay = document.querySelector(".bg-black");
      expect(overlay).toHaveClass("opacity-50");

      await act(async () => {
        await user.click(overlay!);
      });

      // Menu should close
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("translate-x-full");
    });

    it("should close menu when clicking a navigation link", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });

      // Open menu
      await act(async () => {
        await user.click(menuButton);
      });

      // Click a nav link
      const aboutLink = screen.getByRole("link", { name: /about/i });
      await act(async () => {
        await user.click(aboutLink);
      });

      // Menu should close
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("translate-x-full");
    });
  });

  describe("Navigation Content", () => {
    it("should render all navigation items in menu", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu
      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      await user.click(menuButton);

      // Check all nav items are present
      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /services/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /contact/i })
      ).toBeInTheDocument();
    });

    it("should render CTA button in menu", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu
      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      await user.click(menuButton);

      // Check CTA button
      const ctaButton = screen.getByRole("link", { name: /book a session/i });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveClass(
        "bg-[#0205B7]",
        "text-white",
        "rounded-full"
      );
    });

    it("should render contact info in menu", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu
      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      await user.click(menuButton);

      // Check contact info
      expect(screen.getByText(/Roy, WA/i)).toBeInTheDocument();
      expect(
        screen.getByText(/hello@reikigoddesshealing.com/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/555.*123.*4567/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      // The button already has aria-label="Toggle menu" in the component
      expect(menuButton).toHaveAttribute("aria-label");
      expect(menuButton).toHaveAttribute("aria-expanded");
    });

    it("should trap focus in menu when open", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });

      // Open menu
      await user.click(menuButton);

      // Tab through menu items
      await user.tab();
      expect(document.activeElement).toHaveAttribute("href", "/");

      await user.tab();
      expect(document.activeElement).toHaveAttribute("href", "/about");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Tab to logo first, then menu button
      await user.tab(); // Focus on logo link
      await user.tab(); // Focus on menu button
      expect(document.activeElement).toHaveAttribute("aria-label");

      // Open with Enter key
      await act(async () => {
        await user.keyboard("{Enter}");
      });

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("translate-x-0");

      // Close menu with another Enter on the button
      await act(async () => {
        await user.keyboard("{Enter}");
      });
      expect(nav).toHaveClass("translate-x-full");
    });
  });

  describe("Responsive Behavior", () => {
    it("should have fixed positioning", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("fixed");
      expect(header).toHaveClass("top-0");
      expect(header).toHaveClass("left-0");
      expect(header).toHaveClass("right-0");
    });

    it("should have proper z-index layering", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const header = screen.getByRole("banner");
      const nav = screen.getByRole("navigation");

      expect(header).toHaveClass("z-50");
      // Note: z-45 is not a standard Tailwind class, checking for custom class
      expect(nav.className).toContain("z-45");
    });

    it("should include spacer for fixed header", () => {
      const { container } = renderWithRouter(
        <MobileHeader {...defaultProps} />
      );

      const spacer = container.querySelector(".h-\\[60px\\]");
      expect(spacer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle no navigation items", () => {
      renderWithRouter(
        <MobileHeader logo={defaultProps.logo} navigationItems={[]} />
      );

      // Should still render header and menu button
      expect(screen.getByAltText("Test Logo")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /toggle menu/i })
      ).toBeInTheDocument();
    });

    it("should use default props when none provided", () => {
      renderWithRouter(<MobileHeader />);

      // Should render with defaults
      expect(
        screen.getByAltText("The Reiki Goddess Healing")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /toggle menu/i })
      ).toBeInTheDocument();
    });
  });
});
