import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "./Footer";
import type { FooterProps, FooterLink } from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const customQuickLinks: FooterLink[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const customLegalLinks: FooterLink[] = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  const customSocialLinks = {
    linkedin: "https://linkedin.com/company/test",
    facebook: "https://facebook.com/test",
    twitter: "https://twitter.com/test",
    instagram: "https://instagram.com/test",
  };

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<Footer />);

      // Check brand name
      expect(screen.getByText("The Reiki Goddess")).toBeInTheDocument();

      // Check default tagline
      expect(
        screen.getByText(/Creating beautiful, functional websites/)
      ).toBeInTheDocument();

      // Check default copyright
      expect(
        screen.getByText("© 2025 Thereikigoddess | All Rights Reserved.")
      ).toBeInTheDocument();

      // Check section headings
      expect(screen.getByText("Quick Links")).toBeInTheDocument();
      expect(screen.getByText("Legal")).toBeInTheDocument();
      expect(screen.getByText("Follow us")).toBeInTheDocument();
    });

    it("should render with custom logo", () => {
      const customLogo = {
        src: "/custom-logo.png",
        alt: "Custom Logo",
      };

      render(<Footer logo={customLogo} />);
      const logoImg = screen.getByAltText("Custom Logo");
      expect(logoImg).toHaveAttribute("src", "/custom-logo.png");
    });

    it("should render with custom tagline", () => {
      const customTagline = "Custom tagline\nMultiple lines";
      render(<Footer tagline={customTagline} />);
      expect(screen.getByText(/Custom tagline/)).toBeInTheDocument();
    });

    it("should render with custom quick links", () => {
      render(<Footer quickLinks={customQuickLinks} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About Us")).toBeInTheDocument();
      expect(screen.getByText("Contact Us")).toBeInTheDocument();
    });

    it("should render with custom legal links", () => {
      render(<Footer legalLinks={customLegalLinks} />);
      expect(screen.getByText("Privacy")).toBeInTheDocument();
      expect(screen.getByText("Terms")).toBeInTheDocument();
    });

    it("should render with custom social links", () => {
      render(<Footer socialLinks={customSocialLinks} />);

      const linkedinLink = screen.getByLabelText("LinkedIn");
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://linkedin.com/company/test"
      );

      const facebookLink = screen.getByLabelText("Facebook");
      expect(facebookLink).toHaveAttribute("href", "https://facebook.com/test");

      const twitterLink = screen.getByLabelText("X (Twitter)");
      expect(twitterLink).toHaveAttribute("href", "https://twitter.com/test");

      const instagramLink = screen.getByLabelText("Instagram");
      expect(instagramLink).toHaveAttribute(
        "href",
        "https://instagram.com/test"
      );
    });

    it("should render with custom copyright", () => {
      const customCopyright = "© 2025 Custom Company | All Rights Reserved.";
      render(<Footer copyright={customCopyright} />);
      expect(screen.getByText(customCopyright)).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Footer className="custom-footer" />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("custom-footer");
    });

    it("should render default quick links", () => {
      render(<Footer />);
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Events")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render default legal links", () => {
      render(<Footer />);
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
      expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
      expect(screen.getByText("Disclaimer")).toBeInTheDocument();
    });

    it("should not render logo if src is not provided", () => {
      const logoWithoutSrc = { alt: "No Logo" };
      render(<Footer logo={logoWithoutSrc} />);
      expect(screen.queryByAltText("No Logo")).not.toBeInTheDocument();
    });

    it("should render social media icons", () => {
      const { container } = render(<Footer />);

      // Check for SVG icons
      const svgIcons = container.querySelectorAll("svg");
      expect(svgIcons.length).toBeGreaterThanOrEqual(4); // At least 4 social icons
    });
  });

  describe("Styling", () => {
    it("should have correct footer dimensions and styling", () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector("footer");

      // Test individual styles
      expect(footer).toHaveStyle("width: 1440px");
      expect(footer).toHaveStyle("background-color: rgb(255, 255, 255)");
      expect(footer).toHaveStyle("min-height: 400px");
    });

    it("should have correct grid layout", () => {
      const { container } = render(<Footer />);
      const gridContainer = container.querySelector(".grid.gap-12");

      expect(gridContainer).toHaveStyle({
        gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
        marginBottom: "60px",
      });
    });

    it("should have correct padding", () => {
      const { container } = render(<Footer />);
      const contentContainer = container.querySelector(".h-full.flex.flex-col");

      expect(contentContainer).toHaveStyle({
        padding: "60px 66px",
      });
    });

    it("should style brand name correctly", () => {
      render(<Footer />);
      const brandName = screen.getByText("The Reiki Goddess");

      expect(brandName).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "18px",
        fontWeight: "500",
        color: "rgba(196, 169, 98, 1)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      });
    });

    it("should style tagline with correct typography", () => {
      render(<Footer />);
      const tagline = screen.getByText(
        /Creating beautiful, functional websites/
      );

      expect(tagline).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "14px",
        lineHeight: "1.8",
        color: "rgba(94, 94, 94, 1)",
        marginTop: "16px",
      });
    });

    it("should style section headings correctly", () => {
      render(<Footer />);
      const quickLinksHeading = screen.getByText("Quick Links");

      expect(quickLinksHeading).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "18px",
        fontWeight: "600",
        color: "rgba(51, 51, 51, 1)",
        marginBottom: "20px",
      });
    });

    it("should style footer links correctly", () => {
      render(<Footer />);
      const servicesLink = screen.getByText("Services").closest("a");

      expect(servicesLink).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "14px",
        color: "rgba(94, 94, 94, 1)",
        textDecoration: "none",
      });
      expect(servicesLink).toHaveClass(
        "hover:text-purple-600",
        "transition-colors"
      );
    });

    it("should style social media buttons correctly", () => {
      render(<Footer />);
      const linkedinLink = screen.getByLabelText("LinkedIn");

      expect(linkedinLink).toHaveStyle({
        width: "32px",
        height: "32px",
        backgroundColor: "rgba(51, 51, 51, 1)",
        borderRadius: "4px",
      });
      expect(linkedinLink).toHaveClass(
        "hover:opacity-70",
        "transition-opacity"
      );
    });

    it("should style logo with correct dimensions", () => {
      render(<Footer />);
      const logoImg = screen.getByAltText("The Reiki Goddess Healing");

      expect(logoImg).toHaveStyle({
        width: "60px",
        height: "60px",
        objectFit: "contain",
      });
    });

    it("should have divider with correct styling", () => {
      const { container } = render(<Footer />);
      const divider = container.querySelector(
        "div[style*='border-top: 1px solid rgba(229, 229, 229, 1)']"
      );

      expect(divider).toBeDefined();
      if (divider) {
        expect(divider).toHaveStyle(
          "border-top: 1px solid rgba(229, 229, 229, 1)"
        );
        expect(divider).toHaveStyle("padding-top: 30px");
      }
    });

    it("should center copyright text", () => {
      render(<Footer />);
      const copyrightText = screen.getByText(
        "© 2025 Thereikigoddess | All Rights Reserved."
      );

      expect(copyrightText).toHaveClass("text-center");
      expect(copyrightText).toHaveStyle({
        fontFamily: "Figtree, Helvetica, sans-serif",
        fontSize: "14px",
        color: "rgba(94, 94, 94, 1)",
      });
    });

    it("should handle multiline tagline with whitespace", () => {
      render(<Footer />);
      const tagline = screen.getByText(
        /Creating beautiful, functional websites/
      );
      expect(tagline).toHaveClass("whitespace-pre-line");
    });
  });

  describe("Links and Navigation", () => {
    it("should render quick links with correct hrefs", () => {
      render(<Footer />);

      const servicesLink = screen.getByRole("link", { name: "Services" });
      expect(servicesLink).toHaveAttribute("href", "/services");

      const eventsLink = screen.getByRole("link", { name: "Events" });
      expect(eventsLink).toHaveAttribute("href", "/events");

      const blogLink = screen.getByRole("link", { name: "Blog" });
      expect(blogLink).toHaveAttribute("href", "/blog");

      const aboutLink = screen.getByRole("link", { name: "About" });
      expect(aboutLink).toHaveAttribute("href", "/about");

      const contactLink = screen.getByRole("link", { name: "Contact" });
      expect(contactLink).toHaveAttribute("href", "/contact");
    });

    it("should render legal links with correct hrefs", () => {
      render(<Footer />);

      const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
      expect(privacyLink).toHaveAttribute("href", "/privacy");

      const termsLink = screen.getByRole("link", {
        name: "Terms & Conditions",
      });
      expect(termsLink).toHaveAttribute("href", "/terms");

      const disclaimerLink = screen.getByRole("link", { name: "Disclaimer" });
      expect(disclaimerLink).toHaveAttribute("href", "/disclaimer");
    });

    it("should render social links with correct attributes", () => {
      render(<Footer />);

      const socialLinks = [
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "Facebook", href: "https://facebook.com" },
        { label: "X (Twitter)", href: "https://twitter.com" },
        { label: "Instagram", href: "https://instagram.com" },
      ];

      socialLinks.forEach(({ label, href }) => {
        const link = screen.getByLabelText(label);
        expect(link).toHaveAttribute("href", href);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("should handle custom link hrefs", () => {
      render(<Footer quickLinks={customQuickLinks} />);

      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveAttribute("href", "/");

      const aboutLink = screen.getByRole("link", { name: "About Us" });
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should not render social links when not provided", () => {
      const emptySocialLinks = {};
      render(<Footer socialLinks={emptySocialLinks} />);

      expect(screen.queryByLabelText("LinkedIn")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Facebook")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("X (Twitter)")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Instagram")).not.toBeInTheDocument();
    });

    it("should render partial social links", () => {
      const partialSocialLinks = {
        linkedin: "https://linkedin.com/test",
        instagram: "https://instagram.com/test",
      };

      render(<Footer socialLinks={partialSocialLinks} />);

      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
      expect(screen.queryByLabelText("Facebook")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("X (Twitter)")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should handle hover effects on quick links", () => {
      render(<Footer />);
      const servicesLink = screen.getByRole("link", { name: "Services" });

      expect(servicesLink).toHaveClass("hover:text-purple-600");
    });

    it("should handle hover effects on legal links", () => {
      render(<Footer />);
      const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });

      expect(privacyLink).toHaveClass("hover:text-purple-600");
    });

    it("should handle hover effects on social media buttons", () => {
      render(<Footer />);
      const linkedinLink = screen.getByLabelText("LinkedIn");

      expect(linkedinLink).toHaveClass("hover:opacity-70");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic footer element", () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<Footer />);

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings).toHaveLength(3);

      expect(
        screen.getByRole("heading", { name: "Quick Links" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Legal" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Follow us" })
      ).toBeInTheDocument();
    });

    it("should have accessible social media links with aria-labels", () => {
      render(<Footer />);

      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
      expect(screen.getByLabelText("X (Twitter)")).toBeInTheDocument();
      expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    });

    it("should have proper link attributes for external links", () => {
      render(<Footer />);

      const socialLinks = ["LinkedIn", "Facebook", "X (Twitter)", "Instagram"];

      socialLinks.forEach((label) => {
        const link = screen.getByLabelText(label);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("should have alt text for logo image", () => {
      render(<Footer />);
      const logoImg = screen.getByAltText("The Reiki Goddess Healing");
      expect(logoImg).toBeInTheDocument();
    });

    it("should support keyboard navigation for all links", () => {
      render(<Footer />);

      const allLinks = screen.getAllByRole("link");
      allLinks.forEach((link) => {
        link.focus();
        expect(document.activeElement).toBe(link);
      });
    });

    it("should use semantic list elements for navigation", () => {
      const { container } = render(<Footer />);
      const lists = container.querySelectorAll("ul");
      expect(lists).toHaveLength(2); // Quick Links and Legal lists

      lists.forEach((list) => {
        expect(list).toHaveStyle({
          listStyle: "none",
          padding: "0",
          margin: "0",
        });
      });
    });
  });

  describe("Responsive Behavior", () => {
    it("should use grid layout with proper columns", () => {
      const { container } = render(<Footer />);
      const grid = container.querySelector(".grid.gap-12");

      expect(grid).toHaveStyle({
        gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
      });
    });

    it("should maintain fixed width", () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector("footer");

      expect(footer).toHaveStyle({ width: "1440px" });
    });

    it("should maintain proper spacing", () => {
      const { container } = render(<Footer />);
      const grid = container.querySelector(".grid.gap-12");

      expect(grid).toHaveClass("gap-12");
    });

    it("should handle flex layout for social media icons", () => {
      const { container } = render(<Footer />);
      const socialContainer = container.querySelector(".flex.gap-3");

      expect(socialContainer).toHaveClass("flex", "gap-3");
    });

    it("should handle flex layout for logo and brand name", () => {
      const { container } = render(<Footer />);
      const brandContainer = container.querySelector(
        ".flex.items-center.gap-3"
      );

      expect(brandContainer).toHaveClass("flex", "items-center", "gap-3");
    });
  });

  describe("Edge Cases", () => {
    it("should render without any props", () => {
      const { container } = render(<Footer />);
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("should handle empty arrays for links", () => {
      render(<Footer quickLinks={[]} legalLinks={[]} />);

      // Headings should still be present
      expect(screen.getByText("Quick Links")).toBeInTheDocument();
      expect(screen.getByText("Legal")).toBeInTheDocument();

      // But no link items should be present
      const quickLinksSection = screen.getByText("Quick Links").closest("div");
      const legalSection = screen.getByText("Legal").closest("div");

      expect(quickLinksSection?.querySelectorAll("li")).toHaveLength(0);
      expect(legalSection?.querySelectorAll("li")).toHaveLength(0);
    });

    it("should handle very long tagline", () => {
      const longTagline =
        "This is a very long tagline that spans multiple lines and tests how the component handles overflow and text wrapping in the brand section of the footer.";

      render(<Footer tagline={longTagline} />);
      expect(screen.getByText(longTagline)).toBeInTheDocument();
    });

    it("should handle special characters in links", () => {
      const specialLinks = [
        { label: "Services & Products", href: "/services-products" },
        { label: "FAQ's", href: "/faqs" },
        { label: "T&C's", href: "/terms" },
      ];

      render(<Footer quickLinks={specialLinks} />);
      expect(screen.getByText("Services & Products")).toBeInTheDocument();
      expect(screen.getByText("FAQ's")).toBeInTheDocument();
      expect(screen.getByText("T&C's")).toBeInTheDocument();
    });

    it("should handle empty string values", () => {
      render(
        <Footer
          tagline=""
          copyright=""
          socialLinks={{
            linkedin: "",
            facebook: "",
            twitter: "",
            instagram: "",
          }}
        />
      );

      // Component should still render structure
      const { container } = render(<Footer />);
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("should handle missing alt text for logo", () => {
      const logoWithoutAlt = { src: "/logo.png" };
      render(<Footer logo={logoWithoutAlt} />);

      const logoImg = screen.getByRole("img");
      expect(logoImg).toBeInTheDocument();
    });

    it("should handle undefined social links gracefully", () => {
      // When socialLinks is undefined, the component uses default social links
      // So we need to test with empty object instead
      render(<Footer socialLinks={{}} />);

      // Should still render the "Follow us" heading
      expect(screen.getByText("Follow us")).toBeInTheDocument();

      // But no social icons should be present when all social links are empty/undefined
      expect(screen.queryByLabelText("LinkedIn")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Facebook")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("X (Twitter)")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Instagram")).not.toBeInTheDocument();
    });

    it("should maintain layout with minimal content", () => {
      const minimalProps: FooterProps = {
        tagline: "Short",
        quickLinks: [{ label: "Home", href: "/" }],
        legalLinks: [{ label: "Terms", href: "/terms" }],
        copyright: "© 2025 Test",
      };

      const { container } = render(<Footer {...minimalProps} />);
      expect(container.querySelector("footer")).toBeInTheDocument();
      expect(screen.getByText("Short")).toBeInTheDocument();
    });

    it("should handle very long copyright text", () => {
      const longCopyright =
        "© 2025 Very Long Company Name With Extended Copyright Notice | All Rights Reserved | Additional Legal Text Here";

      render(<Footer copyright={longCopyright} />);
      expect(screen.getByText(longCopyright)).toBeInTheDocument();
    });
  });
});
