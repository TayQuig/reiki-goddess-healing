/**
 * Tests for coordinate utilities
 * The Reiki Goddess Healing project
 */

import { describe, it, expect } from "vitest";
import {
  validateCoordinates,
  validateCoordinatesObject,
  getDistance,
  getBounds,
  getBoundsCenter,
  isWithinBounds,
  formatCoordinates,
} from "./coordinateUtils";

describe("validateCoordinates", () => {
  it("validates coordinates within valid ranges", () => {
    expect(validateCoordinates(47.0451, -122.4689)).toBe(true); // Roy, WA
    expect(validateCoordinates(0, 0)).toBe(true); // Equator, Prime Meridian
    expect(validateCoordinates(90, 180)).toBe(true); // North Pole, Date Line
    expect(validateCoordinates(-90, -180)).toBe(true); // South Pole, Date Line
  });

  it("rejects coordinates outside valid ranges", () => {
    expect(validateCoordinates(91, 0)).toBe(false); // Latitude too high
    expect(validateCoordinates(-91, 0)).toBe(false); // Latitude too low
    expect(validateCoordinates(0, 181)).toBe(false); // Longitude too high
    expect(validateCoordinates(0, -181)).toBe(false); // Longitude too low
  });

  it("rejects non-numeric values", () => {
    expect(validateCoordinates("47" as any, -122.4689)).toBe(false);
    expect(validateCoordinates(47.0451, "-122" as any)).toBe(false);
    expect(validateCoordinates(null as any, undefined as any)).toBe(false);
  });

  it("rejects NaN and infinite values", () => {
    expect(validateCoordinates(NaN, -122.4689)).toBe(false);
    expect(validateCoordinates(47.0451, NaN)).toBe(false);
    expect(validateCoordinates(Infinity, -122.4689)).toBe(false);
    expect(validateCoordinates(47.0451, -Infinity)).toBe(false);
  });
});

describe("validateCoordinatesObject", () => {
  it("validates valid coordinates objects", () => {
    expect(validateCoordinatesObject({ lat: 47.0451, lng: -122.4689 })).toBe(
      true
    );
    expect(validateCoordinatesObject({ lat: 0, lng: 0 })).toBe(true);
  });

  it("rejects invalid coordinates objects", () => {
    expect(validateCoordinatesObject({ lat: 91, lng: 0 })).toBe(false);
    expect(validateCoordinatesObject({ lat: 0, lng: 181 })).toBe(false);
    expect(validateCoordinatesObject({ lat: "47", lng: -122 })).toBe(false);
    expect(validateCoordinatesObject({ latitude: 47, longitude: -122 })).toBe(
      false
    );
  });

  it("rejects non-objects", () => {
    expect(validateCoordinatesObject(null)).toBe(false);
    expect(validateCoordinatesObject(undefined)).toBe(false);
    expect(validateCoordinatesObject("coordinates")).toBe(false);
    expect(validateCoordinatesObject(123)).toBe(false);
    expect(validateCoordinatesObject([])).toBe(false);
  });

  it("rejects incomplete objects", () => {
    expect(validateCoordinatesObject({ lat: 47 })).toBe(false);
    expect(validateCoordinatesObject({ lng: -122 })).toBe(false);
    expect(validateCoordinatesObject({})).toBe(false);
  });
});

describe("getDistance", () => {
  const seattle = { lat: 47.6062, lng: -122.3321 };
  const roy = { lat: 47.0451, lng: -122.4689 };
  const tokyo = { lat: 35.6762, lng: 139.6503 };

  it("calculates distance between two points correctly", () => {
    const distance = getDistance(seattle, roy);
    expect(distance).toBeCloseTo(62.8, 0); // Approximately 62.8 km
  });

  it("returns 0 for identical coordinates", () => {
    const distance = getDistance(seattle, seattle);
    expect(distance).toBe(0);
  });

  it("calculates long distances correctly", () => {
    const distance = getDistance(seattle, tokyo);
    expect(distance).toBeGreaterThan(7000); // Trans-Pacific distance
    expect(distance).toBeLessThan(8000);
  });

  it("handles coordinates near poles", () => {
    const northPole = { lat: 89.9, lng: 0 };
    const nearNorthPole = { lat: 89.8, lng: 0 };
    const distance = getDistance(northPole, nearNorthPole);
    expect(distance).toBeCloseTo(11.1, 0); // ~11.1 km
  });

  it("throws error for invalid coordinates", () => {
    expect(() => getDistance({ lat: 91, lng: 0 }, roy)).toThrow(
      "Invalid coordinates provided"
    );
    expect(() => getDistance(seattle, { lat: 0, lng: 181 })).toThrow(
      "Invalid coordinates provided"
    );
    expect(() => getDistance(null as any, roy)).toThrow(
      "Invalid coordinates provided"
    );
  });

  it("returns consistent precision", () => {
    const distance = getDistance(seattle, roy);
    expect(distance.toString()).toMatch(/^\d+\.\d{1,3}$/); // Up to 3 decimal places
  });
});

describe("getBounds", () => {
  const roy = { lat: 47.0451, lng: -122.4689 };

  it("calculates bounds for a given radius", () => {
    const bounds = getBounds(roy, 10); // 10km radius

    expect(bounds.southwest.lat).toBeLessThan(roy.lat);
    expect(bounds.northeast.lat).toBeGreaterThan(roy.lat);
    expect(bounds.southwest.lng).toBeLessThan(roy.lng);
    expect(bounds.northeast.lng).toBeGreaterThan(roy.lng);

    // Check approximate bounds (10km ≈ 0.09° lat, varies for lng)
    expect(bounds.northeast.lat - bounds.southwest.lat).toBeCloseTo(0.18, 1);
  });

  it("handles zero radius", () => {
    const bounds = getBounds(roy, 0);
    expect(bounds.southwest).toEqual(roy);
    expect(bounds.northeast).toEqual(roy);
  });

  it("ensures bounds stay within coordinate limits", () => {
    const northPole = { lat: 89.9, lng: 0 };
    const bounds = getBounds(northPole, 1000); // Large radius near pole

    expect(bounds.northeast.lat).toBeLessThanOrEqual(90);
    expect(bounds.southwest.lat).toBeGreaterThanOrEqual(-90);
    expect(bounds.northeast.lng).toBeLessThanOrEqual(180);
    expect(bounds.southwest.lng).toBeGreaterThanOrEqual(-180);
  });

  it("throws error for invalid center coordinates", () => {
    expect(() => getBounds({ lat: 91, lng: 0 }, 10)).toThrow(
      "Invalid center coordinates provided"
    );
    expect(() => getBounds(null as any, 10)).toThrow(
      "Invalid center coordinates provided"
    );
  });

  it("throws error for invalid radius", () => {
    expect(() => getBounds(roy, -5)).toThrow("Invalid radius provided");
    expect(() => getBounds(roy, NaN)).toThrow("Invalid radius provided");
    expect(() => getBounds(roy, Infinity)).toThrow("Invalid radius provided");
    expect(() => getBounds(roy, "10" as any)).toThrow(
      "Invalid radius provided"
    );
  });
});

describe("getBoundsCenter", () => {
  it("calculates center of bounds correctly", () => {
    const bounds = {
      southwest: { lat: 47.0, lng: -123.0 },
      northeast: { lat: 47.1, lng: -122.0 },
    };

    const center = getBoundsCenter(bounds);
    expect(center.lat).toBe(47.05);
    expect(center.lng).toBe(-122.5);
  });

  it("handles equal bounds (point)", () => {
    const bounds = {
      southwest: { lat: 47.0451, lng: -122.4689 },
      northeast: { lat: 47.0451, lng: -122.4689 },
    };

    const center = getBoundsCenter(bounds);
    expect(center).toEqual({ lat: 47.0451, lng: -122.4689 });
  });

  it("throws error for invalid bounds", () => {
    expect(() => getBoundsCenter(null as any)).toThrow(
      "Invalid bounds provided"
    );
    expect(() => getBoundsCenter({} as any)).toThrow("Invalid bounds provided");
    expect(() =>
      getBoundsCenter({
        southwest: { lat: 91, lng: 0 },
        northeast: { lat: 47, lng: -122 },
      })
    ).toThrow("Invalid bounds provided");
  });
});

describe("isWithinBounds", () => {
  const bounds = {
    southwest: { lat: 47.0, lng: -123.0 },
    northeast: { lat: 47.1, lng: -122.0 },
  };

  it("returns true for coordinates within bounds", () => {
    expect(isWithinBounds({ lat: 47.05, lng: -122.5 }, bounds)).toBe(true);
    expect(isWithinBounds({ lat: 47.0, lng: -123.0 }, bounds)).toBe(true); // Southwest corner
    expect(isWithinBounds({ lat: 47.1, lng: -122.0 }, bounds)).toBe(true); // Northeast corner
  });

  it("returns false for coordinates outside bounds", () => {
    expect(isWithinBounds({ lat: 46.9, lng: -122.5 }, bounds)).toBe(false); // South
    expect(isWithinBounds({ lat: 47.2, lng: -122.5 }, bounds)).toBe(false); // North
    expect(isWithinBounds({ lat: 47.05, lng: -121.5 }, bounds)).toBe(false); // East
    expect(isWithinBounds({ lat: 47.05, lng: -123.5 }, bounds)).toBe(false); // West
  });

  it("handles invalid coordinates", () => {
    expect(isWithinBounds({ lat: 91, lng: 0 }, bounds)).toBe(false);
    expect(isWithinBounds(null as any, bounds)).toBe(false);
  });

  it("handles invalid bounds", () => {
    expect(isWithinBounds({ lat: 47.05, lng: -122.5 }, null as any)).toBe(
      false
    );
    expect(
      isWithinBounds(
        { lat: 47.05, lng: -122.5 },
        {
          southwest: { lat: 91, lng: 0 },
          northeast: { lat: 47, lng: -122 },
        }
      )
    ).toBe(false);
  });
});

describe("formatCoordinates", () => {
  it("formats coordinates with default precision", () => {
    expect(formatCoordinates({ lat: 47.0451, lng: -122.4689 })).toBe(
      "47.0451, -122.4689"
    );
    expect(formatCoordinates({ lat: 0, lng: 0 })).toBe("0.0000, 0.0000");
  });

  it("formats coordinates with custom precision", () => {
    expect(formatCoordinates({ lat: 47.0451, lng: -122.4689 }, 2)).toBe(
      "47.05, -122.47"
    );
    expect(formatCoordinates({ lat: 47.0451, lng: -122.4689 }, 6)).toBe(
      "47.045100, -122.468900"
    );
  });

  it("handles precision edge cases", () => {
    expect(formatCoordinates({ lat: 47.0451, lng: -122.4689 }, 0)).toBe(
      "47, -122"
    );
    expect(formatCoordinates({ lat: 47.0451, lng: -122.4689 }, -1)).toBe(
      "47.0451, -122.4689"
    );
    expect(formatCoordinates({ lat: 47.0451, lng: -122.4689 }, 15)).toBe(
      "47.0451, -122.4689"
    );
  });

  it("returns error message for invalid coordinates", () => {
    expect(formatCoordinates({ lat: 91, lng: 0 })).toBe("Invalid coordinates");
    expect(formatCoordinates(null as any)).toBe("Invalid coordinates");
    expect(formatCoordinates({ lat: "47", lng: -122 } as any)).toBe(
      "Invalid coordinates"
    );
  });

  it("handles extreme coordinate values", () => {
    expect(formatCoordinates({ lat: 90, lng: 180 })).toBe("90.0000, 180.0000");
    expect(formatCoordinates({ lat: -90, lng: -180 })).toBe(
      "-90.0000, -180.0000"
    );
  });
});
