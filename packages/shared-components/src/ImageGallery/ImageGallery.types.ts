export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ImageGalleryProps {
  heading?: string;
  images: GalleryImage[];
  seeMoreButton?: {
    text: string;
    onClick: () => void;
    ariaLabel?: string;
  };
  className?: string;
}
