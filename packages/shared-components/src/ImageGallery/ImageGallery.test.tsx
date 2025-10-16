import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageGallery } from "./ImageGallery";
import type { ImageGalleryProps, GalleryImage } from "./ImageGallery.types";

describe("ImageGallery", () => {
  const mockImages: GalleryImage[] = [
    {
      src: "/img/gallery-1.png",
      alt: "Gallery image 1",
      width: 898,
      height: 343,
    },
    {
      src: "/img/gallery-2.png",
      alt: "Gallery image 2",
      width: 391,
      height: 343,
    },
    {
      src: "/img/gallery-3.png",
      alt: "Gallery image 3",
      width: 487,
      height: 343,
    },
    {
      src: "/img/gallery-4.png",
      alt: "Gallery image 4",
      width: 391,
      height: 343,
    },
    {
      src: "/img/gallery-5.png",
      alt: "Gallery image 5",
      width: 391,
      height: 343,
    },
  ];

  const mockProps: ImageGalleryProps = {
    heading: "Image Gallery",
    images: mockImages,
    seeMoreButton: {
      text: "See More",
      onClick: vi.fn(),
      ariaLabel: "See more gallery images",
    },
  };

  it("renders gallery heading", () => {
    render(<ImageGallery {...mockProps} />);
    expect(screen.getByText("Image Gallery")).toBeInTheDocument();
  });

  it("renders all gallery images", () => {
    render(<ImageGallery {...mockProps} />);

    expect(screen.getByAltText("Gallery image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery image 2")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery image 3")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery image 4")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery image 5")).toBeInTheDocument();
  });

  it("renders images with correct sources", () => {
    render(<ImageGallery {...mockProps} />);

    const img1 = screen.getByAltText("Gallery image 1");
    expect(img1).toHaveAttribute("src", "/img/gallery-1.png");
  });

  it("renders See More button when provided", () => {
    render(<ImageGallery {...mockProps} />);
    const button = screen.getByRole("button", { name: /see more/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick when See More button is clicked", () => {
    const handleClick = vi.fn();
    const propsWithClick = {
      ...mockProps,
      seeMoreButton: { text: "See More", onClick: handleClick },
    };

    render(<ImageGallery {...propsWithClick} />);
    const button = screen.getByRole("button", { name: /see more/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders without heading when not provided", () => {
    const propsWithoutHeading = { ...mockProps, heading: undefined };
    render(<ImageGallery {...propsWithoutHeading} />);
    expect(screen.queryByText("Image Gallery")).not.toBeInTheDocument();
  });

  it("renders without See More button when not provided", () => {
    const propsWithoutButton = { ...mockProps, seeMoreButton: undefined };
    render(<ImageGallery {...propsWithoutButton} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders with partial images array", () => {
    const partialImages = mockImages.slice(0, 3);
    render(<ImageGallery {...mockProps} images={partialImages} />);

    expect(screen.getByAltText("Gallery image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery image 2")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery image 3")).toBeInTheDocument();
    expect(screen.queryByAltText("Gallery image 4")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ImageGallery {...mockProps} className="custom-gallery" />
    );
    expect(container.querySelector(".custom-gallery")).toBeInTheDocument();
  });

  it("uses proper ARIA label for See More button", () => {
    render(<ImageGallery {...mockProps} />);
    const button = screen.getByLabelText("See more gallery images");
    expect(button).toBeInTheDocument();
  });

  it("applies lazy loading to images", () => {
    render(<ImageGallery {...mockProps} />);
    const images = screen.getAllByRole("img");

    images.forEach((img) => {
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  it("renders masonry grid with correct structure", () => {
    const { container } = render(<ImageGallery {...mockProps} />);
    const rows = container.querySelectorAll(".flex.gap-\\[20px\\]");

    // Should have 2 rows in the masonry grid (excluding the outer container)
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });
});
