import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AboutHero } from "./AboutHero";
import type { AboutHeroProps } from "./AboutHero.types";

describe("AboutHero", () => {
  const mockProps: AboutHeroProps = {
    heading: "Experienced Reiki Master & Sound Healer in Roy",
    leftColumnText: (
      <>
        As an{" "}
        <strong className="text-[#0205B7]">experienced Reiki Master</strong> and
        certified Sound Healer, my mission is to help you reconnect with your
        inner balance.
      </>
    ),
    rightColumnText: (
      <>
        With years of practice in{" "}
        <strong className="text-[#0205B7]">energy healing</strong> and{" "}
        <strong className="text-[#0205B7]">holistic wellness</strong>, I combine
        gentle Reiki techniques.
      </>
    ),
    bottomText: "Every healing session is tailored to your unique needs...",
    heroImage: {
      src: "/img/hero-image.png",
      alt: "Healing session in progress",
    },
    decorativeImage: {
      src: "/img/decorative-overlay.png",
      alt: "Decorative background",
    },
    ctaButton: {
      text: "Learn More",
      onClick: vi.fn(),
      ariaLabel: "Learn more about our services",
    },
  };

  it("renders main heading", () => {
    render(<AboutHero {...mockProps} />);
    expect(
      screen.getByText("Experienced Reiki Master & Sound Healer in Roy")
    ).toBeInTheDocument();
  });

  it("renders left column text", () => {
    render(<AboutHero {...mockProps} />);
    const leftColumnElements = screen.getAllByText(/experienced Reiki Master/i);
    expect(leftColumnElements.length).toBeGreaterThan(0);
  });

  it("renders right column text", () => {
    render(<AboutHero {...mockProps} />);
    expect(screen.getByText(/energy healing/i)).toBeInTheDocument();
  });

  it("renders bottom text when provided", () => {
    render(<AboutHero {...mockProps} />);
    expect(
      screen.getByText(/Every healing session is tailored/i)
    ).toBeInTheDocument();
  });

  it("renders hero image", () => {
    render(<AboutHero {...mockProps} />);
    const heroImage = screen.getByAltText("Healing session in progress");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "/img/hero-image.png");
  });

  it("renders decorative image when provided", () => {
    render(<AboutHero {...mockProps} />);
    const decorativeImage = screen.getByAltText("Decorative background");
    expect(decorativeImage).toBeInTheDocument();
  });

  it("renders CTA button when provided", () => {
    render(<AboutHero {...mockProps} />);
    const button = screen.getByRole("button", { name: /learn more/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when CTA button is clicked", () => {
    const handleClick = vi.fn();
    const propsWithClick = {
      ...mockProps,
      ctaButton: { text: "Learn More", onClick: handleClick },
    };

    render(<AboutHero {...propsWithClick} />);
    const button = screen.getByRole("button", { name: /learn more/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders without bottom text", () => {
    const propsWithoutBottomText = { ...mockProps };
    delete propsWithoutBottomText.bottomText;
    const { container } = render(<AboutHero {...propsWithoutBottomText} />);
    expect(
      container.querySelector('[class*="top-[1075px]"]')
    ).not.toBeInTheDocument();
  });

  it("renders without decorative image", () => {
    const propsWithoutDecorative = { ...mockProps };
    delete propsWithoutDecorative.decorativeImage;
    render(<AboutHero {...propsWithoutDecorative} />);
    expect(
      screen.queryByAltText("Decorative background")
    ).not.toBeInTheDocument();
  });

  it("renders without CTA button", () => {
    const propsWithoutCTA = { ...mockProps };
    delete propsWithoutCTA.ctaButton;
    render(<AboutHero {...propsWithoutCTA} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AboutHero {...mockProps} className="custom-hero" />
    );
    expect(container.querySelector(".custom-hero")).toBeInTheDocument();
  });

  it("uses proper ARIA label for button", () => {
    render(<AboutHero {...mockProps} />);
    const button = screen.getByLabelText("Learn more about our services");
    expect(button).toBeInTheDocument();
  });
});
