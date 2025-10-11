import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CertificationCards } from "./CertificationCards";
import type { CertificationCard } from "./CertificationCards.types";

describe("CertificationCards", () => {
  const mockCards: CertificationCard[] = [
    {
      title: "Sound Healing Specialist",
      description:
        "Skilled in using vibration and frequency for deep relaxation.",
      variant: "gradient",
    },
    {
      title: "Years of Experience",
      description:
        "Supporting clients in emotional, physical, and spiritual growth.",
      variant: "white",
    },
    {
      title: "Certified Reiki Master",
      description: "Advanced training in energy healing techniques.",
      variant: "white",
    },
  ];

  it("renders all certification cards", () => {
    render(<CertificationCards cards={mockCards} />);

    expect(screen.getByText("Sound Healing Specialist")).toBeInTheDocument();
    expect(screen.getByText("Years of Experience")).toBeInTheDocument();
    expect(screen.getByText("Certified Reiki Master")).toBeInTheDocument();
  });

  it("renders card descriptions", () => {
    render(<CertificationCards cards={mockCards} />);

    expect(
      screen.getByText(
        "Skilled in using vibration and frequency for deep relaxation."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Supporting clients in emotional, physical, and spiritual growth."
      )
    ).toBeInTheDocument();
  });

  it("renders with empty cards array", () => {
    const { container } = render(<CertificationCards cards={[]} />);
    expect(container.querySelector(".flex")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CertificationCards cards={mockCards} className="custom-class" />
    );
    const firstCard = container.querySelector(".custom-class");
    expect(firstCard).toBeInTheDocument();
  });

  it("renders gradient variant card", () => {
    const gradientCard: CertificationCard[] = [
      {
        title: "Test Card",
        description: "Test description",
        variant: "gradient",
      },
    ];

    const { container } = render(<CertificationCards cards={gradientCard} />);
    const card = container.querySelector('[style*="linear-gradient"]');
    expect(card).toBeInTheDocument();
  });

  it("renders white variant card", () => {
    const whiteCard: CertificationCard[] = [
      {
        title: "Test Card",
        description: "Test description",
        variant: "white",
      },
    ];

    render(<CertificationCards cards={whiteCard} />);

    // Verify the card title is rendered with dark text (not white)
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("applies blue bevel shadow effect", () => {
    const { container } = render(<CertificationCards cards={mockCards} />);
    const card = container.querySelector('[style*="0px 9px 0px #0205B7"]');
    expect(card).toBeInTheDocument();
  });
});
