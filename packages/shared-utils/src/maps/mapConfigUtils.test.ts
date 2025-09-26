/**
 * Tests for map configuration utilities
 * The Reiki Goddess Healing project
 */

import { describe, it, expect, vi } from "vitest";
import {
  buildEmbedUrl,
  buildDirectionsUrl,
  buildSearchUrl,
  getDefaultMapOptions,
  getMapStyles,
  validateMapConfig,
} from "./mapConfigUtils";

// Mock console.warn to test warning messages
const mockWarn = vi.fn();
vi.stubGlobal("console", { ...console, warn: mockWarn });

describe("buildEmbedUrl", () => {
  it("builds URL with query parameter", () => {
    const url = buildEmbedUrl({ query: "Roy, WA" });
    expect(url).toBe("https://www.google.com/maps/embed/v1/place?q=Roy%2C+WA");
  });

  it("builds URL with center coordinates", () => {
    const url = buildEmbedUrl({
      center: { lat: 47.0451, lng: -122.4689 },
    });
    expect(url).toBe(
      "https://www.google.com/maps/embed/v1/place?center=47.0451%2C-122.4689"
    );
  });

  it("includes zoom parameter", () => {
    const url = buildEmbedUrl({
      query: "Roy, WA",
      zoom: 15,
    });
    expect(url).toBe(
      "https://www.google.com/maps/embed/v1/place?q=Roy%2C+WA&zoom=15"
    );
  });

  it("includes valid maptype parameter", () => {
    const url = buildEmbedUrl({
      query: "Roy, WA",
      maptype: "satellite",
    });
    expect(url).toBe(
      "https://www.google.com/maps/embed/v1/place?q=Roy%2C+WA&maptype=satellite"
    );
  });

  it("includes language parameter", () => {
    const url = buildEmbedUrl({
      query: "Roy, WA",
      language: "en-US",
    });
    expect(url).toBe(
      "https://www.google.com/maps/embed/v1/place?q=Roy%2C+WA&language=en-us"
    );
  });

  it("includes region parameter", () => {
    const url = buildEmbedUrl({
      query: "Roy, WA",
      region: "US",
    });
    expect(url).toBe(
      "https://www.google.com/maps/embed/v1/place?q=Roy%2C+WA&region=US"
    );
  });

  it("handles all parameters together", () => {
    const url = buildEmbedUrl({
      query: "Roy, WA",
      zoom: 15,
      maptype: "hybrid",
      language: "en",
      region: "US",
    });
    expect(url).toContain("q=Roy%2C+WA");
    expect(url).toContain("zoom=15");
    expect(url).toContain("maptype=hybrid");
    expect(url).toContain("language=en");
    expect(url).toContain("region=US");
  });

  it("validates zoom parameter", () => {
    mockWarn.mockClear();
    buildEmbedUrl({
      query: "Roy, WA",
      zoom: 25, // Invalid zoom
    });
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid zoom level provided. Must be between 1 and 21."
    );
  });

  it("validates maptype parameter", () => {
    mockWarn.mockClear();
    buildEmbedUrl({
      query: "Roy, WA",
      maptype: "invalid" as any,
    });
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid map type: invalid. Using default."
    );
  });

  it("validates language parameter", () => {
    mockWarn.mockClear();
    buildEmbedUrl({
      query: "Roy, WA",
      language: "invalid123",
    });
    expect(mockWarn).toHaveBeenCalledWith("Invalid language code: invalid123");
  });

  it("validates region parameter", () => {
    mockWarn.mockClear();
    buildEmbedUrl({
      query: "Roy, WA",
      region: "invalid",
    });
    expect(mockWarn).toHaveBeenCalledWith("Invalid region code: invalid");
  });

  it("throws error for missing parameters", () => {
    expect(() => buildEmbedUrl(null as any)).toThrow(
      "Parameters are required for building embed URL"
    );
    expect(() => buildEmbedUrl({})).toThrow(
      "Either query or valid center coordinates must be provided"
    );
  });

  it("throws error for invalid query", () => {
    expect(() => buildEmbedUrl({ query: "" })).toThrow(
      "Either query or valid center coordinates must be provided"
    );
    expect(() =>
      buildEmbedUrl({ query: "<script>alert('xss')</script>" })
    ).toThrow("Invalid or empty query provided");
  });

  it("throws error for invalid coordinates", () => {
    expect(() =>
      buildEmbedUrl({
        center: { lat: 91, lng: 0 },
      })
    ).toThrow("Either query or valid center coordinates must be provided");
  });
});

describe("buildDirectionsUrl", () => {
  it("builds basic directions URL", () => {
    const url = buildDirectionsUrl("Seattle, WA", "Roy, WA");
    expect(url).toBe(
      "https://www.google.com/maps/dir/Seattle%2C%20WA/Roy%2C%20WA"
    );
  });

  it("includes travel mode", () => {
    const url = buildDirectionsUrl("Seattle, WA", "Roy, WA", "walking");
    expect(url).toBe(
      "https://www.google.com/maps/dir/Seattle%2C%20WA/Roy%2C%20WA/@travelmode=walking"
    );
  });

  it("handles all travel modes", () => {
    expect(buildDirectionsUrl("A", "B", "bicycling")).toContain(
      "@travelmode=bicycling"
    );
    expect(buildDirectionsUrl("A", "B", "transit")).toContain(
      "@travelmode=transit"
    );
    expect(buildDirectionsUrl("A", "B", "driving")).not.toContain(
      "@travelmode"
    );
  });

  it("sanitizes addresses", () => {
    const url = buildDirectionsUrl(
      "123 <script>alert('xss')</script> Main St",
      "456 Oak Ave"
    );
    expect(url).not.toContain("<script>");
    expect(url).toContain("123%20Main%20St");
  });

  it("throws error for missing addresses", () => {
    expect(() => buildDirectionsUrl("", "Roy, WA")).toThrow(
      "Both from and to addresses are required"
    );
    expect(() => buildDirectionsUrl("Seattle, WA", "")).toThrow(
      "Both from and to addresses are required"
    );
    expect(() => buildDirectionsUrl(null as any, "Roy, WA")).toThrow(
      "Both from and to addresses are required"
    );
  });

  it("throws error for invalid addresses after sanitization", () => {
    expect(() =>
      buildDirectionsUrl("<script>alert('xss')</script>", "Roy, WA")
    ).toThrow("Invalid addresses provided");
  });
});

describe("buildSearchUrl", () => {
  it("builds search URL correctly", () => {
    const url = buildSearchUrl("coffee shops near Roy, WA");
    expect(url).toBe(
      "https://www.google.com/maps/search/coffee%20shops%20near%20Roy%2C%20WA"
    );
  });

  it("sanitizes search query", () => {
    const url = buildSearchUrl("coffee <script>alert('xss')</script> shops");
    expect(url).not.toContain("<script>");
    expect(url).toContain("coffee%20shops");
  });

  it("throws error for empty query", () => {
    expect(() => buildSearchUrl("")).toThrow("Search query is required");
    expect(() => buildSearchUrl("   ")).toThrow("Search query is required");
  });

  it("throws error for invalid query", () => {
    expect(() => buildSearchUrl("<script>alert('xss')</script>")).toThrow(
      "Invalid search query provided"
    );
  });
});

describe("getDefaultMapOptions", () => {
  it("returns default options", () => {
    const options = getDefaultMapOptions();
    expect(options).toEqual({
      center: { lat: 47.0451, lng: -122.4689 },
      zoom: 15,
      mapTypeId: "roadmap",
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });
  });

  it("merges custom options", () => {
    const options = getDefaultMapOptions({
      zoom: 18,
      center: { lat: 47.6062, lng: -122.3321 },
    });

    expect(options.zoom).toBe(18);
    expect(options.center).toEqual({ lat: 47.6062, lng: -122.3321 });
    expect(options.mapTypeId).toBe("roadmap"); // Default preserved
  });

  it("validates custom zoom", () => {
    mockWarn.mockClear();
    const options = getDefaultMapOptions({ zoom: 25 });
    expect(options.zoom).toBe(15); // Falls back to default
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid zoom level in custom options. Using default."
    );
  });

  it("validates custom center", () => {
    mockWarn.mockClear();
    const options = getDefaultMapOptions({
      center: { lat: 91, lng: 0 },
    });
    expect(options.center).toEqual({ lat: 47.0451, lng: -122.4689 }); // Falls back to default
    expect(mockWarn).toHaveBeenCalledWith(
      "Invalid center coordinates in custom options. Using default."
    );
  });

  it("merges boolean options correctly", () => {
    const options = getDefaultMapOptions({
      disableDefaultUI: true,
      zoomControl: false,
    });

    expect(options.disableDefaultUI).toBe(true);
    expect(options.zoomControl).toBe(false);
    expect(options.streetViewControl).toBe(true); // Default preserved
  });
});

describe("getMapStyles", () => {
  it("returns undefined for default theme", () => {
    expect(getMapStyles("default")).toBeUndefined();
  });

  it("returns minimal styles", () => {
    const styles = getMapStyles("minimal");
    expect(styles).toHaveLength(2);
    expect(styles![0]).toMatchObject({
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    });
  });

  it("returns dark styles", () => {
    const styles = getMapStyles("dark");
    expect(styles).toHaveLength(3);
    expect(styles![0]).toMatchObject({
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }],
    });
  });

  it("returns healing styles", () => {
    const styles = getMapStyles("healing");
    expect(styles).toHaveLength(3);
    expect(styles![0]).toMatchObject({
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#a8d8d8" }],
    });
  });
});

describe("validateMapConfig", () => {
  it("validates correct configuration", () => {
    const result = validateMapConfig({
      zoom: 15,
      center: { lat: 47.0451, lng: -122.4689 },
      mapTypeId: "roadmap",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("detects invalid zoom", () => {
    const result = validateMapConfig({ zoom: 25 });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Invalid zoom level. Must be between 1 and 21."
    );
  });

  it("detects invalid coordinates", () => {
    const result = validateMapConfig({
      center: { lat: 91, lng: 0 },
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invalid center coordinates.");
  });

  it("detects invalid map type", () => {
    const result = validateMapConfig({
      mapTypeId: "invalid" as any,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Invalid map type. Must be one of: roadmap, satellite, hybrid, terrain."
    );
  });

  it("accumulates multiple errors", () => {
    const result = validateMapConfig({
      zoom: 25,
      center: { lat: 91, lng: 181 },
      mapTypeId: "invalid" as any,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  it("validates empty configuration", () => {
    const result = validateMapConfig({});
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
