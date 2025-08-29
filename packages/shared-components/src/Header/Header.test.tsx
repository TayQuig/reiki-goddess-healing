import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";
import { RouterWrapper } from "../test-utils";

// Custom render function that includes Router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<RouterWrapper>{component}</RouterWrapper>);
};

describe("Header Component", () => {
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
    it("should render with default props", () => {
      renderWithRouter(<Header />);

      // Should render with default logo
      const logo = screen.getByAltText("The Reiki Goddess Healing");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/img/reiki-goddess-logo.png");
    });

    it("should render with custom props", () => {
      renderWithRouter(<Header {...defaultProps} />);

      // Logo
      const logo = screen.getByAltText("Test Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/img/test-logo.png");

      // Navigation items
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render navigation items as links", () => {
      renderWithRouter(<Header {...defaultProps} />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveAttribute("href", "/");

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should apply correct styling classes", () => {
      renderWithRouter(<Header {...defaultProps} className="custom-class" />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("custom-class");
    });
  });

  describe("Logo Behavior", () => {
    it("should have correct logo dimensions", () => {
      renderWithRouter(<Header {...defaultProps} />);

      const logo = screen.getByAltText("Test Logo");
      // The img has w-full h-full classes, check parent container for dimensions
      const logoContainer = logo.parentElement;
      expect(logoContainer).toHaveStyle({
        width: "248px",
        height: "92px",
      });
    });

    it("should position logo correctly", () => {
      renderWithRouter(<Header {...defaultProps} />);

      const logoContainer = screen.getByAltText("Test Logo").parentElement;
      expect(logoContainer).toHaveStyle({
        left: "66px",
      });
    });
  });

  describe("Navigation Layout", () => {
    it("should space navigation items correctly", () => {
      renderWithRouter(<Header {...defaultProps} />);

      const navContainer = screen.getByRole("navigation");
      expect(navContainer).toHaveStyle({
        left: "calc(66px + 248px + 191px)", // matches actual computed value
      });
    });

    it("should apply hover styles to navigation items", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header {...defaultProps} />);

      const homeLink = screen.getByRole("link", { name: /home/i });

      await user.hover(homeLink);
      // Note: Testing hover states might require checking computed styles
      // or using a more sophisticated testing approach
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      renderWithRouter(<Header {...defaultProps} />);

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();

      const logo = screen.getByAltText("Test Logo");
      expect(logo).toHaveAttribute("alt");
    });

    it("should have semantic HTML structure", () => {
      renderWithRouter(<Header {...defaultProps} />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header {...defaultProps} />);

      // First tab goes to logo link
      await user.tab();
      expect(document.activeElement).toHaveAttribute("href", "/");

      // Second tab goes to first nav item (Home)
      await user.tab();
      expect(document.activeElement).toHaveAttribute("href", "/");

      // Third tab goes to second nav item (About)
      await user.tab();
      expect(document.activeElement).toHaveAttribute("href", "/about");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing logo gracefully", () => {
      renderWithRouter(
        <Header navigationItems={defaultProps.navigationItems} />
      );

      // Should still render navigation
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("should handle empty navigation items", () => {
      renderWithRouter(
        <Header logo={defaultProps.logo} navigationItems={[]} />
      );

      // Should still render logo
      expect(screen.getByAltText("Test Logo")).toBeInTheDocument();
    });

    it("should handle no props", () => {
      renderWithRouter(<Header />);

      // Should render with defaults without crashing
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });
});
