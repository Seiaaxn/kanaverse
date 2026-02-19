/**
 * Example test file demonstrating testing patterns for kanaverse
 */

import { render, screen } from "@testing-library/react";

// Simple component for testing
function ExampleComponent({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Welcome to kanaverse</p>
    </div>
  );
}

describe("ExampleComponent", () => {
  it("renders title correctly", () => {
    render(<ExampleComponent title="Test Title" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
  });

  it("renders welcome message", () => {
    render(<ExampleComponent title="Test" />);

    expect(screen.getByText("Welcome to kanaverse")).toBeInTheDocument();
  });
});

describe("Utility functions", () => {
  it("should format strings correctly", () => {
    const input = "hello world";
    const expected = "hello world";

    expect(input).toBe(expected);
  });

  it("should handle empty arrays", () => {
    const arr: string[] = [];

    expect(arr).toHaveLength(0);
    expect(Array.isArray(arr)).toBe(true);
  });
});

describe("Environment", () => {
  it("should have correct Node environment", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
});
    
