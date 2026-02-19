/**
 * Tests for auth-config utilities
 */

import { isClerkConfigured } from "@/lib/auth-config";

describe("isClerkConfigured", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns false when no key is set", () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false for empty string", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false for pk_test_placeholder", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_placeholder";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false for pk_test_dummy", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_dummy";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false for keys not starting with pk_", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "sk_test_something";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false for keys with less than 3 segments", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false when third segment is 'dummy'", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_dummy";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns false when third segment is 'placeholder'", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_placeholder";
    expect(isClerkConfigured()).toBe(false);
  });

  it("returns true for valid Clerk key format", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_abc123xyz456";
    expect(isClerkConfigured()).toBe(true);
  });

  it("returns true for live Clerk key", () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_live_realkey123";
    expect(isClerkConfigured()).toBe(true);
  });
});
      
