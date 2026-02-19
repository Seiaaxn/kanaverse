/**
 * Tests for Card component
 */

import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/Card";
import type { Komik, Anime } from "@/types";

describe("Card", () => {
  const mockKomik: Komik = {
    manga_id: "test-manga-123",
    title: "Test Manga Title",
    thumbnail: "https://example.com/cover.jpg",
    rating: 8.5,
    type: "Manhwa",
    latestChapter: "Chapter 100",
  };

  const mockAnime: Anime = {
    urlId: "test-anime-456",
    title: "Test Anime Title",
    thumbnail: "https://example.com/poster.jpg",
    rating: 9.0,
    score: 9.0,
    type: "TV",
    poster: "https://example.com/poster.jpg",
  };

  describe("Komik Card", () => {
    it("renders komik title", () => {
      render(<Card item={mockKomik} type="komik" />);
      expect(screen.getByText("Test Manga Title")).toBeInTheDocument();
    });

    it("renders komik type badge", () => {
      render(<Card item={mockKomik} type="komik" />);
      expect(screen.getByText("Manhwa")).toBeInTheDocument();
    });

    it("renders rating badge", () => {
      render(<Card item={mockKomik} type="komik" />);
      expect(screen.getByText("8.5")).toBeInTheDocument();
    });

    it("renders latest chapter info", () => {
      render(<Card item={mockKomik} type="komik" />);
      expect(screen.getByText("Ch. Chapter 100")).toBeInTheDocument();
    });

    it("links to correct komik page", () => {
      render(<Card item={mockKomik} type="komik" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/komik/test-manga-123");
    });

    it("renders image with correct alt text", () => {
      render(<Card item={mockKomik} type="komik" />);
      const image = screen.getByAltText("Test Manga Title");
      expect(image).toBeInTheDocument();
    });
  });

  describe("Anime Card", () => {
    it("renders anime title", () => {
      render(<Card item={mockAnime} type="anime" />);
      expect(screen.getByText("Test Anime Title")).toBeInTheDocument();
    });

    it("renders anime type badge", () => {
      render(<Card item={mockAnime} type="anime" />);
      expect(screen.getByText("TV")).toBeInTheDocument();
    });

    it("links to correct anime page", () => {
      render(<Card item={mockAnime} type="anime" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/anime/test-anime-456");
    });
  });

  describe("Edge Cases", () => {
    it("returns null for item without id", () => {
      const invalidItem = { title: "No ID" } as Komik;
      const { container } = render(<Card item={invalidItem} type="komik" />);
      expect(container.firstChild).toBeNull();
    });

    it("handles missing thumbnail gracefully", () => {
      const noThumbKomik = { ...mockKomik, thumbnail: undefined, cover: undefined };
      render(<Card item={noThumbKomik} type="komik" />);
      expect(screen.getByText("Test Manga Title")).toBeInTheDocument();
    });

    it("displays 'Untitled' for missing title", () => {
      const noTitleKomik = { ...mockKomik, title: "" };
      render(<Card item={noTitleKomik} type="komik" />);
      expect(screen.getByText("Untitled")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Card item={mockKomik} type="komik" className="custom-card" />);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-card");
    });

    it("does not render rating badge when rating is missing", () => {
      const noRatingKomik = { ...mockKomik, rating: undefined };
      render(<Card item={noRatingKomik} type="komik" />);
      expect(screen.queryByText("8.5")).not.toBeInTheDocument();
    });

    it("does not render type badge when type is missing", () => {
      const noTypeKomik = { ...mockKomik, type: undefined };
      render(<Card item={noTypeKomik} type="komik" />);
      expect(screen.queryByText("Manhwa")).not.toBeInTheDocument();
    });

    it("truncates long titles", () => {
      const longTitleKomik = {
        ...mockKomik,
        title: "This is a very long title that should be truncated after fifty characters",
      };
      render(<Card item={longTitleKomik} type="komik" />);
      // Title should be truncated with ellipsis
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading.textContent?.length).toBeLessThanOrEqual(53); // 50 + "..."
    });
  });

  describe("Animation", () => {
    it("accepts index prop for stagger animation", () => {
      // This test just ensures the component accepts the prop without error
      render(<Card item={mockKomik} type="komik" index={5} />);
      expect(screen.getByText("Test Manga Title")).toBeInTheDocument();
    });
  });
});
           
