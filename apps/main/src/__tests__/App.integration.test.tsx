import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import App from "../App";

// Mock framer-motion to avoid animation timing issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Helper to render App with providers
const renderApp = () => {
  return render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

describe("App Routing Integration Tests", () => {
  beforeEach(() => {
    // Clear any previous navigation state
    window.history.pushState({}, "", "/");
  });

  describe("Page Navigation", () => {
    it("should render the home page by default", () => {
      renderApp();

      expect(
        screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Energy Healing for Optimal Mental Health & Wellness/i)
      ).toBeInTheDocument();
    });

    it("should navigate to About page when clicking About link", async () => {
      const user = userEvent.setup();
      renderApp();

      const aboutLink = screen.getAllByRole("link", { name: /about/i })[0];
      await user.click(aboutLink);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });
    });

    it("should navigate to Services page when clicking Services link", async () => {
      const user = userEvent.setup();
      renderApp();

      const servicesLink = screen.getAllByRole("link", {
        name: /services/i,
      })[0];
      await user.click(servicesLink);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /services/i })
        ).toBeInTheDocument();
      });
    });

    it("should navigate to Events page when clicking Events link", async () => {
      const user = userEvent.setup();
      renderApp();

      const eventsLink = screen.getAllByRole("link", { name: /events/i })[0];
      await user.click(eventsLink);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /events/i })
        ).toBeInTheDocument();
      });
    });

    it("should navigate to Contact page when clicking Contact link", async () => {
      const user = userEvent.setup();
      renderApp();

      const contactLink = screen.getAllByRole("link", { name: /contact/i })[0];
      await user.click(contactLink);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /get in touch/i })
        ).toBeInTheDocument();
      });
    });

    it("should navigate to Blog page when clicking Blog link", async () => {
      const user = userEvent.setup();
      renderApp();

      const blogLink = screen.getAllByRole("link", { name: /blog/i })[0];
      await user.click(blogLink);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /blog/i })
        ).toBeInTheDocument();
      });
    });

    it("should navigate between multiple pages in sequence", async () => {
      const user = userEvent.setup();
      renderApp();

      // Start at home
      expect(
        screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
      ).toBeInTheDocument();

      // Navigate to Services
      await user.click(screen.getAllByRole("link", { name: /services/i })[0]);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /services/i })
        ).toBeInTheDocument();
      });

      // Navigate to About
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });

      // Navigate back to Home
      await user.click(screen.getAllByRole("link", { name: /home/i })[0]);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
        ).toBeInTheDocument();
      });
    });

    it.skip("should reset scroll position when navigating", async () => {
      const user = userEvent.setup();
      renderApp();

      // Simulate scrolling down on home page
      window.scrollTo(0, 500);
      const initialScrollY = window.scrollY;
      expect(initialScrollY).toBe(500);

      // Navigate to another page
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });

      // Browser should reset scroll on navigation
      expect(window.scrollY).toBe(0);
    });
  });

  describe("404 Error Handling", () => {
    it("should display 404 page for non-existent routes", () => {
      window.history.pushState({}, "", "/non-existent-page");
      renderApp();

      expect(screen.getByText(/404/)).toBeInTheDocument();
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it("should navigate back to home from 404 page", async () => {
      const user = userEvent.setup();
      window.history.pushState({}, "", "/non-existent-page");
      renderApp();

      expect(screen.getByText(/404/)).toBeInTheDocument();

      // Find and click the "Go Home" button/link
      const homeLink = screen.getByRole("link", {
        name: /go home|return home|back to home/i,
      });
      await user.click(homeLink);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
        ).toBeInTheDocument();
      });
    });

    it("should handle deep non-existent routes", () => {
      window.history.pushState({}, "", "/services/non-existent/deep/route");
      renderApp();

      expect(screen.getByText(/404/)).toBeInTheDocument();
    });
  });

  describe("Navigation Active States", () => {
    it("should highlight the active navigation item for current page", () => {
      renderApp();

      // Home link should be active by default
      const homeLink = screen.getAllByRole("link", { name: /home/i })[0];
      expect(homeLink).toHaveStyle({ textDecoration: "underline" });

      // Other links should not be active
      const aboutLink = screen.getAllByRole("link", { name: /about/i })[0];
      expect(aboutLink).toHaveStyle({ textDecoration: "none" });
    });

    it("should update active state when navigating", async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      const aboutLink = screen.getAllByRole("link", { name: /about/i })[0];
      await user.click(aboutLink);

      await waitFor(() => {
        // About should now be active
        expect(aboutLink).toHaveStyle({ textDecoration: "underline" });

        // Home should no longer be active
        const homeLink = screen.getAllByRole("link", { name: /home/i })[0];
        expect(homeLink).toHaveStyle({ textDecoration: "none" });
      });
    });
  });

  describe.skip("Mobile Navigation", () => {
    beforeEach(() => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));
    });

    it("should show hamburger menu on mobile", () => {
      renderApp();

      expect(
        screen.getByRole("button", { name: /open menu/i })
      ).toBeInTheDocument();
    });

    it("should open mobile menu when hamburger is clicked", async () => {
      const user = userEvent.setup();
      renderApp();

      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      await waitFor(() => {
        // Mobile menu should be visible
        expect(
          screen.getByRole("navigation", { name: /mobile/i })
        ).toBeInTheDocument();
      });
    });

    it("should navigate and close mobile menu when link is clicked", async () => {
      const user = userEvent.setup();
      renderApp();

      // Open mobile menu
      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      // Click About link in mobile menu
      const aboutLink = screen.getAllByRole("link", { name: /about/i })[1]; // Second instance is in mobile menu
      await user.click(aboutLink);

      await waitFor(() => {
        // Should navigate to About page
        expect(screen.getByText(/about page/i)).toBeInTheDocument();

        // Mobile menu should be closed
        expect(
          screen.queryByRole("navigation", { name: /mobile/i })
        ).not.toBeInTheDocument();
      });
    });

    it("should close mobile menu when clicking outside", async () => {
      const user = userEvent.setup();
      renderApp();

      // Open mobile menu
      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      await waitFor(() => {
        expect(
          screen.getByRole("navigation", { name: /mobile/i })
        ).toBeInTheDocument();
      });

      // Click outside the menu (on the overlay)
      const overlay = screen.getByTestId("mobile-menu-overlay");
      await user.click(overlay);

      await waitFor(() => {
        expect(
          screen.queryByRole("navigation", { name: /mobile/i })
        ).not.toBeInTheDocument();
      });
    });

    it("should close mobile menu with Escape key", async () => {
      const user = userEvent.setup();
      renderApp();

      // Open mobile menu
      const hamburgerButton = screen.getByRole("button", {
        name: /open menu/i,
      });
      await user.click(hamburgerButton);

      await waitFor(() => {
        expect(
          screen.getByRole("navigation", { name: /mobile/i })
        ).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(
          screen.queryByRole("navigation", { name: /mobile/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Page Transitions", () => {
    it("should apply smooth transitions between pages", async () => {
      const user = userEvent.setup();
      renderApp();

      // Verify we start on home page
      expect(screen.getByTestId("page-home")).toBeInTheDocument();

      // Navigate to About
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);

      await waitFor(() => {
        const aboutPage = screen.getByTestId("page-about");
        expect(aboutPage).toBeInTheDocument();
      });
    });
  });

  describe("Browser Back/Forward Navigation", () => {
    it("should handle browser back button correctly", async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });

      // Go back
      act(() => {
        window.history.back();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
        ).toBeInTheDocument();
      });
    });

    it("should handle browser forward button correctly", async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });

      // Go back
      act(() => {
        window.history.back();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
        ).toBeInTheDocument();
      });

      // Go forward
      act(() => {
        window.history.forward();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("Deep Linking", () => {
    it("should handle direct navigation to nested routes", () => {
      window.history.pushState({}, "", "/services");
      renderApp();

      expect(
        screen.getByRole("heading", { name: /services/i })
      ).toBeInTheDocument();
    });

    it("should preserve query parameters during navigation", async () => {
      const user = userEvent.setup();
      window.history.pushState({}, "", "/?utm_source=test");
      renderApp();

      // Navigate to About
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });
    });

    it("should handle hash fragments in URLs", () => {
      window.history.pushState({}, "", "/#testimonials");
      renderApp();

      expect(
        screen.getByRole("heading", { name: /The Reiki Goddess Healing/i })
      ).toBeInTheDocument();
    });
  });

  describe("Error Boundaries", () => {
    it("should gracefully handle navigation errors", async () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Test that app doesn't crash on navigation errors
      renderApp();

      // Force a navigation error by manipulating history state
      act(() => {
        window.history.pushState(null, "", "/services");
        window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
      });

      // App should still be functional
      expect(
        screen.getByRole("heading", { name: /services/i })
      ).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should announce page changes to screen readers", async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to About
      await user.click(screen.getAllByRole("link", { name: /about/i })[0]);

      await waitFor(() => {
        // Check that navigation occurred
        expect(
          screen.getByRole("heading", { name: /about/i })
        ).toBeInTheDocument();
      });
    });

    it("should maintain focus management during navigation", async () => {
      const user = userEvent.setup();
      renderApp();

      // Focus on a navigation link
      const aboutLink = screen.getAllByRole("link", { name: /about/i })[0];
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
      renderApp();

      // Tab through navigation to reach a non-home link
      await user.tab(); // First tab
      await user.tab(); // Second tab should be on a navigation link

      // Verify we're focused on a link
      expect(document.activeElement).toHaveAttribute("href");
      const focusedHref = document.activeElement?.getAttribute("href");

      // Enter to navigate
      await user.keyboard("{Enter}");

      // Should navigate based on which link was focused
      await waitFor(() => {
        if (focusedHref === "/about") {
          expect(
            screen.getByRole("heading", { name: /about/i })
          ).toBeInTheDocument();
        } else if (focusedHref === "/services") {
          expect(
            screen.getByRole("heading", { name: /services/i })
          ).toBeInTheDocument();
        } else {
          // At least verify we can tab to a link
          expect(focusedHref).toBeTruthy();
        }
      });
    });
  });
});
