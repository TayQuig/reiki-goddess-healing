/**
 * BlogSearch Component Types
 */

export interface BlogSearchProps {
  /**
   * Current search query value
   */
  value: string;

  /**
   * Callback when search query changes
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text for search input
   */
  placeholder?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
