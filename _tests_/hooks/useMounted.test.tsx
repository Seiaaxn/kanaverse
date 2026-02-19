/**
 * Tests for useMounted hook
 */

import { renderHook } from "@testing-library/react";
import { useMounted } from "@/hooks/useMounted";

describe("useMounted", () => {
  it("returns true on client side (after hydration)", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });

  it("maintains consistent value across re-renders", () => {
    const { result, rerender } = renderHook(() => useMounted());

    const firstValue = result.current;
    rerender();
    const secondValue = result.current;

    expect(firstValue).toBe(secondValue);
    expect(result.current).toBe(true);
  });

  it("can be used in multiple components", () => {
    const { result: result1 } = renderHook(() => useMounted());
    const { result: result2 } = renderHook(() => useMounted());

    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);
  });
});
