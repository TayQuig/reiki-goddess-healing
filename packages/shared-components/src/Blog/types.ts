/**
 * Blog Type System
 *
 * Re-exports blog types from @reiki-goddess/shared-utils for backward compatibility.
 * The canonical type definitions live in shared-utils to avoid circular dependencies.
 */

export type {
  BlogCategory,
  Author,
  BlogPost,
  BlogFilters,
  PaginationConfig,
  BlogListingResponse,
  NewsletterSubscription,
  LinkConfig,
  BlogPageConfig,
} from "@reiki-goddess/shared-utils";
