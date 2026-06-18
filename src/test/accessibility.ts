/// <reference types="vitest/globals" />
import { axe, toHaveNoViolations } from "jest-axe";
import type { RenderResult } from "@testing-library/react";

expect.extend(toHaveNoViolations);

export async function assertAccessible(container: HTMLElement | RenderResult) {
  const element = container instanceof HTMLElement ? container : container.container;
  const results = await axe(element);
  expect(results).toHaveNoViolations();
}
