/**
 * BlogHero Component Types
 *
 * Type definitions for the blog page hero section.
 */

export interface BlogHeroProps {
  /**
   * Main heading text for the hero section
   * @default "Healing Insights"
   */
  title?: string;

  /**
   * Supporting description text
   * @default "Explore articles, insights, and guidance on your healing journey from The Reiki Goddess community."
   */
  description?: string;

  /**
   * Optional background image URL
   */
  backgroundImage?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
