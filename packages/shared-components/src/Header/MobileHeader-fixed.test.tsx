import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileHeader } from "./MobileHeader";
import type { MobileHeaderProps, NavigationItem } from "./types";
import { RouterWrapper } from "../test-utils/RouterWrapper";

// Mock requestAnimationFrame to run synchronously in tests
beforeAll(() => {
  global.requestAnimationFrame = vi.fn((cb) => {
    cb(0);
    return 0;
  }) as any;
});

afterEach(() => {
  vi.clearAllMocks();
});

// Helper function to render with router
const renderWithRouter = (ui: React.ReactElement, initialEntries = ["/"]) => {
  const result = render(
    <RouterWrapper initialEntries={initialEntries}>{ui}</RouterWrapper>
  );
  return result;
};

// Helper to open mobile menu and wait for all async updates
async function openMobileMenu(user: ReturnType<typeof userEvent.setup>) {
  const menuButton = screen.getByRole("button", { name: /toggle menu/i });
  await user.click(menuButton);
  
  // Wait for menu to open
  await waitFor(() => {
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("translate-x-0");
  });
  
  // Wait for focus to move to first nav link
  await waitFor(() => {
    const firstNavLink = screen.getByRole("link", { name: /home/i });
    expect(document.activeElement).toBe(firstNavLink);
  });
}

describe("MobileHeader Component", () => {
  const defaultProps: MobileHeaderProps = {
    navigationItems: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  };

  describe("Rendering", () => {
    it("should render hamburger menu button", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);
      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it("should render navigation in closed state initially", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("translate-x-full");
    });

    it("should render all navigation items", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu using helper
      await openMobileMenu(user);

      defaultProps.navigationItems.forEach((item) => {
        const link = screen.getByRole("link", { name: item.label });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", item.href);
      });
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

      // Use helper to open menu
      await openMobileMenu(user);
      
      // Verify menu is open
      expect(nav).toHaveClass("translate-x-0");
      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      // Click to close
      await user.click(menuButton);
      
      // Wait for menu to close and focus to return
      await waitFor(() => {
        expect(nav).toHaveClass("translate-x-full");
        expect(menuButton).toHaveAttribute("aria-expanded", "false");
      });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(menuButton);
      });
    });

    it("should animate hamburger icon on toggle", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });

      // Initial state - verify no animation classes
      const initialSpans = menuButton.querySelectorAll("span");
      expect(initialSpans[0]).not.toHaveClass("rotate-45");
      expect(initialSpans[1]).not.toHaveClass("opacity-0");
      expect(initialSpans[2]).not.toHaveClass("-rotate-45");

      // Use helper to open menu (handles async properly)
      await openMobileMenu(user);
      
      // Verify animation classes are applied
      const spans = menuButton.querySelectorAll("span");
      expect(spans[0]).toHaveClass("rotate-45");
      expect(spans[1]).toHaveClass("opacity-0");
      expect(spans[2]).toHaveClass("-rotate-45");

      // Click to close menu
      await user.click(menuButton);
      
      // Wait for animation classes to be removed and focus to return
      await waitFor(() => {
        const updatedSpans = menuButton.querySelectorAll("span");
        expect(updatedSpans[0]).not.toHaveClass("rotate-45");
        expect(updatedSpans[1]).not.toHaveClass("opacity-0");
        expect(updatedSpans[2]).not.toHaveClass("-rotate-45");
      });
      
      // Wait for focus to return
      await waitFor(() => {
        expect(document.activeElement).toBe(menuButton);
      });
    });

    it("should close menu when clicking overlay", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu and wait for it
      await openMobileMenu(user);

      // Find and click overlay (it has role="button")
      const overlay = screen.getAllByRole("button").find(el => 
        el.className.includes("bg-black")
      );
      expect(overlay).toBeDefined();

      await user.click(overlay!);

      // Wait for menu to close and focus to return
      await waitFor(() => {
        const nav = screen.getByRole("navigation");
        expect(nav).toHaveClass("translate-x-full");
      });
      
      await waitFor(() => {
        const menuButton = screen.getByRole("button", { name: /toggle menu/i });
        expect(document.activeElement).toBe(menuButton);
      });
    });

    it("should close menu when clicking a navigation link", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu and wait for it
      await openMobileMenu(user);

      // Click a nav link
      const aboutLink = screen.getByRole("link", { name: /about/i });
      await user.click(aboutLink);

      // Wait for menu to close
      await waitFor(() => {
        const nav = screen.getByRole("navigation");
        expect(nav).toHaveClass("translate-x-full");
      });
    });

    it("should close menu on escape key", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu and wait for it
      await openMobileMenu(user);

      // Press escape key
      await user.keyboard("{Escape}");

      // Wait for menu to close and focus to return
      await waitFor(() => {
        const nav = screen.getByRole("navigation");
        expect(nav).toHaveClass("translate-x-full");
      });
      
      await waitFor(() => {
        const menuButton = screen.getByRole("button", { name: /toggle menu/i });
        expect(document.activeElement).toBe(menuButton);
      });
    });
  });

  describe("Navigation Content", () => {
    it("should highlight active route", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />, ["/about"]);

      // Open menu using helper
      await openMobileMenu(user);

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toHaveClass("text-brand-blue");
      expect(aboutLink.parentElement).toHaveClass("before:scale-x-100");
    });

    it("should display logo in menu", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu using helper
      await openMobileMenu(user);

      const logo = screen.getByAlt("The Reiki Goddess Healing");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/img/logo.png");
    });

    it("should render CTA button", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu using helper
      await openMobileMenu(user);

      const ctaButton = screen.getByRole("link", {
        name: /book a session/i,
      });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveClass("bg-brand-blue");
    });

    it("should render contact info in menu", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu using helper
      await openMobileMenu(user);

      expect(screen.getByText("Get in Touch")).toBeInTheDocument();
      expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
      expect(
        screen.getByText("contact@reikigoddesshealing.com")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should trap focus in menu when open", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu and verify focus
      await openMobileMenu(user);

      const firstNavLink = screen.getByRole("link", { name: /home/i });
      expect(document.activeElement).toBe(firstNavLink);
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderWithRouter(<MobileHeader {...defaultProps} />);

      // Open menu
      await openMobileMenu(user);

      // Tab through navigation
      await user.tab();
      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(document.activeElement).toBe(aboutLink);

      await user.tab();
      const servicesLink = screen.getByRole("link", { name: /services/i });
      expect(document.activeElement).toBe(servicesLink);
    });

    it("should have proper ARIA attributes", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
      expect(menuButton).toHaveAttribute("aria-controls", "mobile-menu");

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("id", "mobile-menu");
      expect(nav).toHaveAttribute("aria-label", "Mobile navigation");
    });
  });

  describe("Responsive Behavior", () => {
    it("should be hidden on desktop", () => {
      renderWithRouter(<MobileHeader {...defaultProps} />);
      
      const mobileHeaderContainer = screen.getByRole("button", { 
        name: /toggle menu/i 
      }).parentElement?.parentElement;
      
      expect(mobileHeaderContainer).toHaveClass("lg:hidden");
    });
  });
});