/**
 * Tests for utility functions in src/lib/utils.ts
 */

import { cn, formatDate, truncate, slugify, getImageUrl } from "@/lib/utils";

describe("cn (class name utility)", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "inactive")).toBe("base active");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });
});

describe("formatDate", () => {
  it("formats Date object correctly", () => {
    const date = new Date("2024-01-15");
    const formatted = formatDate(date);
    // Indonesian locale format: "15 Jan 2024"
    expect(formatted).toContain("2024");
    expect(formatted).toContain("15");
  });

  it("formats date string correctly", () => {
    const formatted = formatDate("2024-06-20");
    expect(formatted).toContain("2024");
    expect(formatted).toContain("20");
  });

  it("handles ISO date strings", () => {
    const formatted = formatDate("2024-12-25T10:30:00Z");
    expect(formatted).toContain("2024");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    const longString = "This is a very long string that should be truncated";
    expect(truncate(longString, 20)).toBe("This is a very long ...");
  });

  it("does not truncate short strings", () => {
    const shortString = "Short";
    expect(truncate(shortString, 20)).toBe("Short");
  });

  it("handles exact length strings", () => {
    const exactString = "Exactly twenty char";
    expect(truncate(exactString, 19)).toBe("Exactly twenty char");
  });

  it("handles empty strings", () => {
    expect(truncate("", 10)).toBe("");
  });

  it("handles zero length", () => {
    expect(truncate("Hello", 0)).toBe("...");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("handles multiple consecutive spaces", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles numbers", () => {
    expect(slugify("Chapter 123")).toBe("chapter-123");
  });
});

describe("getImageUrl", () => {
  it("returns placeholder for empty url", () => {
    expect(getImageUrl("")).toContain("placehold.co");
  });

  it("returns placeholder for 'undefined' string", () => {
    expect(getImageUrl("undefined")).toContain("placehold.co");
  });

  it("returns placeholder for 'null' string", () => {
    expect(getImageUrl("null")).toContain("placehold.co");
  });

  it("returns http url as-is", () => {
    const url = "http://example.com/image.jpg";
    expect(getImageUrl(url)).toBe(url);
  });

  it("returns https url as-is", () => {
    const url = "https://example.com/image.jpg";
    expect(getImageUrl(url)).toBe(url);
  });

  it("prepends https to protocol-relative urls", () => {
    const url = "//example.com/image.jpg";
    expect(getImageUrl(url)).toBe("https://example.com/image.jpg");
  });

  it("returns relative urls as-is", () => {
    const url = "/images/photo.jpg";
    expect(getImageUrl(url)).toBe(url);
  });
});
      
