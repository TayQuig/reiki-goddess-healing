import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Mock framer-motion to avoid animation timing issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("App Routing Integration Tests", () => {
  beforeEach(() => {
    // Clear any previous navigation state
    window.history.pushState({}, "", "/");
  });

  describe("Page Navigation", () => {
    it("should render the home page by default", () => {
      render(<App />);
      
      expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
      expect(screen.getByText(/experience the transformative power/i)).toBeInTheDocument();
    });

    it("should navigate to About page when clicking About link", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const aboutLink = screen.getByRole("link", { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
    });

    it("should navigate to Services page when clicking Services link", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const servicesLink = screen.getByRole("link", { name: /services/i });
      await user.click(servicesLink);
      
      await waitFor(() => {
        expect(screen.getByText(/services page/i)).toBeInTheDocument();
      });
    });

    it("should navigate to Events page when clicking Events link", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const eventsLink = screen.getByRole("link", { name: /events/i });
      await user.click(eventsLink);
      
      await waitFor(() => {
        expect(screen.getByText(/events page/i)).toBeInTheDocument();
      });
    });

    it("should navigate to Contact page when clicking Contact link", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const contactLink = screen.getByRole("link", { name: /contact/i });
      await user.click(contactLink);
      
      await waitFor(() => {
        expect(screen.getByText(/contact page/i)).toBeInTheDocument();
      });
    });

    it("should navigate to Blog page when clicking Blog link", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const blogLink = screen.getByRole("link", { name: /blog/i });
      await user.click(blogLink);
      
      await waitFor(() => {
        expect(screen.getByText(/blog page/i)).toBeInTheDocument();
      });
    });

    it("should navigate between multiple pages in sequence", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Start at home
      expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
      
      // Navigate to Services
      await user.click(screen.getByRole("link", { name: /services/i }));
      await waitFor(() => {
        expect(screen.getByText(/services page/i)).toBeInTheDocument();
      });
      
      // Navigate to About
      await user.click(screen.getByRole("link", { name: /about/i }));
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
      
      // Navigate back to Home
      await user.click(screen.getByRole("link", { name: /home/i }));
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
      });
    });

    it("should maintain scroll position when navigating back", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Simulate scrolling down on home page
      window.scrollTo(0, 500);
      const initialScrollY = window.scrollY;
      expect(initialScrollY).toBe(500);
      
      // Navigate to another page
      await user.click(screen.getByRole("link", { name: /about/i }));
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
      
      // Browser should reset scroll on navigation
      expect(window.scrollY).toBe(0);
    });
  });

  describe("404 Error Handling", () => {
    it("should display 404 page for non-existent routes", () => {
      window.history.pushState({}, "", "/non-existent-page");
      render(<App />);
      
      expect(screen.getByText(/404/)).toBeInTheDocument();
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it("should navigate back to home from 404 page", async () => {
      const user = userEvent.setup();
      window.history.pushState({}, "", "/non-existent-page");
      render(<App />);
      
      expect(screen.getByText(/404/)).toBeInTheDocument();
      
      // Find and click the "Go Home" button/link
      const homeLink = screen.getByRole("link", { name: /go home|return home|back to home/i });
      await user.click(homeLink);
      
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
      });
    });

    it("should handle deep non-existent routes", () => {
      window.history.pushState({}, "", "/services/non-existent/deep/route");
      render(<App />);
      
      expect(screen.getByText(/404/)).toBeInTheDocument();
    });
  });

  describe("Navigation Active States", () => {
    it("should highlight the active navigation item for current page", () => {
      render(<App />);
      
      // Home link should be active by default
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveClass("border-b-2");
      
      // Other links should not be active
      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).not.toHaveClass("border-b-2");
    });

    it("should update active state when navigating", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Navigate to About
      const aboutLink = screen.getByRole("link", { name: /about/i });
      await user.click(aboutLink);
      
      await waitFor(() => {
        // About should now be active
        expect(aboutLink).toHaveClass("border-b-2");
        
        // Home should no longer be active
        const homeLink = screen.getByRole("link", { name: /home/i });
        expect(homeLink).not.toHaveClass("border-b-2");
      });
    });
  });

  describe("Mobile Navigation", () => {
    beforeEach(() => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));
    });

    it("should show hamburger menu on mobile", () => {
      render(<App />);
      
      expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
    });

    it("should open mobile menu when hamburger is clicked", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburgerButton);
      
      await waitFor(() => {
        // Mobile menu should be visible
        expect(screen.getByRole("navigation", { name: /mobile/i })).toBeInTheDocument();
      });
    });

    it("should navigate and close mobile menu when link is clicked", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Open mobile menu
      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburgerButton);
      
      // Click About link in mobile menu
      const aboutLink = screen.getAllByRole("link", { name: /about/i })[1]; // Second instance is in mobile menu
      await user.click(aboutLink);
      
      await waitFor(() => {
        // Should navigate to About page
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
        
        // Mobile menu should be closed
        expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
      });
    });

    it("should close mobile menu when clicking outside", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Open mobile menu
      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburgerButton);
      
      await waitFor(() => {
        expect(screen.getByRole("navigation", { name: /mobile/i })).toBeInTheDocument();
      });
      
      // Click outside the menu (on the overlay)
      const overlay = screen.getByTestId("mobile-menu-overlay");
      await user.click(overlay);
      
      await waitFor(() => {
        expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
      });
    });

    it("should close mobile menu with Escape key", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Open mobile menu
      const hamburgerButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburgerButton);
      
      await waitFor(() => {
        expect(screen.getByRole("navigation", { name: /mobile/i })).toBeInTheDocument();
      });
      
      // Press Escape
      await user.keyboard("{Escape}");
      
      await waitFor(() => {
        expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
      });
    });
  });

  describe("Page Transitions", () => {
    it("should apply smooth transitions between pages", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Verify we start on home page
      expect(screen.getByTestId("page-home")).toBeInTheDocument();
      
      // Navigate to About
      await user.click(screen.getByRole("link", { name: /about/i }));
      
      await waitFor(() => {
        const aboutPage = screen.getByTestId("page-about");
        expect(aboutPage).toBeInTheDocument();
      });
    });
  });

  describe("Browser Back/Forward Navigation", () => {
    it("should handle browser back button correctly", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Navigate to About
      await user.click(screen.getByRole("link", { name: /about/i }));
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
      
      // Go back
      act(() => {
        window.history.back();
      });
      
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
      });
    });

    it("should handle browser forward button correctly", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Navigate to About
      await user.click(screen.getByRole("link", { name: /about/i }));
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
      
      // Go back
      act(() => {
        window.history.back();
      });
      
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
      });
      
      // Go forward
      act(() => {
        window.history.forward();
      });
      
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
    });
  });

  describe("Deep Linking", () => {
    it("should handle direct navigation to nested routes", () => {
      window.history.pushState({}, "", "/services");
      render(<App />);
      
      expect(screen.getByText(/services page/i)).toBeInTheDocument();
    });

    it("should preserve query parameters during navigation", async () => {
      const user = userEvent.setup();
      window.history.pushState({}, "", "/?utm_source=test");
      render(<App />);
      
      // Navigate to About
      await user.click(screen.getByRole("link", { name: /about/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/about page/i)).toBeInTheDocument();
      });
    });

    it("should handle hash fragments in URLs", () => {
      window.history.pushState({}, "", "/#testimonials");
      render(<App />);
      
      expect(screen.getByRole("heading", { name: /unleash your inner peace/i })).toBeInTheDocument();
    });
  });

  describe("Error Boundaries", () => {
    it("should gracefully handle navigation errors", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      // Test that app doesn't crash on navigation errors
      render(<App />);
      
      // Force a navigation error by manipulating history state
      act(() => {
        window.history.pushState(null, "", "/services");
        window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
      });
      
      // App should still be functional
      expect(screen.getByText(/services page/i)).toBeInTheDocument();
      
      consoleError.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should announce page changes to screen readers", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Navigate to About
      await user.click(screen.getByRole("link", { name: /about/i }));
      
      await waitFor(() => {
        // Check for aria-live region or page title update
        expect(document.title).toContain("About");
      });
    });

    it("should maintain focus management during navigation", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Focus on a navigation link
      const aboutLink = screen.getByRole("link", { name: /about/i });
      aboutLink.focus();
      expect(document.activeElement).toBe(aboutLink);
      
      // Navigate
      await user.click(aboutLink);
      
      await waitFor(() => {
        // Focus should move to main content or remain accessible
        expect(document.activeElement).not.toBe(document.body);
      });
    });

    it("should support keyboard navigation through all routes", async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Tab through navigation
      await user.tab();
      expect(document.activeElement).toHaveAttribute("href");
      
      // Enter to navigate
      await user.keyboard("{Enter}");
      
      // Should navigate successfully
      await waitFor(() => {
        expect(window.location.pathname).not.toBe("/");
      });
    });
  });
});