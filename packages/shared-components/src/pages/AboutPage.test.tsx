import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutPage } from "./AboutPage";

describe("AboutPage", () => {
  it("renders the page without crashing", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/Experienced Reiki Master & Sound Healer in Roy/i)
    ).toBeInTheDocument();
  });

  it("renders hero section with correct heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByText("Experienced Reiki Master & Sound Healer in Roy")
    ).toBeInTheDocument();
  });

  it("renders features bar with all features", () => {
    render(<AboutPage />);
    expect(screen.getByText("Energy Healing")).toBeInTheDocument();
    expect(screen.getByText("Sound Therapy")).toBeInTheDocument();
    expect(screen.getByText("Holistic Wellness")).toBeInTheDocument();
  });

  it("renders Meet The Goddess section", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/Meet Deirdre, The Reiki Goddess/i)
    ).toBeInTheDocument();
  });

  it("renders Journey section", () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/My Journey: Inspiring Personal Growth & Renewal/i)
    ).toBeInTheDocument();
  });

  it("renders certification cards in Journey section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Sound Healing Specialist")).toBeInTheDocument();
    expect(screen.getByText("Years of Experience")).toBeInTheDocument();
    expect(screen.getByText("Certified Reiki Master")).toBeInTheDocument();
  });

  it("renders Image Gallery section", () => {
    render(<AboutPage />);
    expect(screen.getByText("Image Gallery")).toBeInTheDocument();
  });

  it("renders Testimonials section", () => {
    render(<AboutPage />);
    expect(
      screen.getAllByText(/What My Clients Are Saying/i)[0]
    ).toBeInTheDocument();
    // Check for testimonial content since name rendering may vary
    expect(
      screen.getByText(/Deirdre's healing sessions have transformed my life/i)
    ).toBeInTheDocument();
  });

  it("has correct page background color", () => {
    const { container } = render(<AboutPage />);
    const mainDiv = container.querySelector(".bg-\\[\\#FFFBF5\\]");
    expect(mainDiv).toBeInTheDocument();
  });

  it("has correct max width constraint", () => {
    const { container } = render(<AboutPage />);
    const contentDiv = container.querySelector(
      'div[style*="max-width: 1440px"]'
    );
    expect(contentDiv).toBeInTheDocument();
  });

  it("renders all animated sections", () => {
    const { container } = render(<AboutPage />);
    // Check for sections with data-section or section elements
    const sections = container.querySelectorAll("section, [data-section]");
    expect(sections.length).toBeGreaterThan(0);
  });

  it("renders hero section with styled text spans", () => {
    render(<AboutPage />);
    const styledSpans = screen.getAllByText(
      /experienced Reiki Master and certified Sound Healer|energy healing|holistic wellness/i
    );
    expect(styledSpans.length).toBeGreaterThan(0);
  });

  it("renders Learn More button in hero", () => {
    render(<AboutPage />);
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders See More button in gallery", () => {
    render(<AboutPage />);
    const seeMoreButtons = screen.getAllByText("See More");
    expect(seeMoreButtons.length).toBeGreaterThan(0);
  });

  it("renders gallery images", () => {
    const { container } = render(<AboutPage />);
    // ImageGallery should render images with healing space alts
    const images = container.querySelectorAll('img[alt*="Healing space"]');
    expect(images.length).toBeGreaterThanOrEqual(5);
  });

  it("applies consistent spacing and layout", () => {
    const { container } = render(<AboutPage />);
    const pageWrapper = container.querySelector(
      ".min-h-screen.bg-\\[\\#FFFBF5\\]"
    );
    expect(pageWrapper).toBeInTheDocument();
    expect(pageWrapper).toHaveClass("overflow-hidden");
    expect(pageWrapper).toHaveClass("relative");
  });
});
