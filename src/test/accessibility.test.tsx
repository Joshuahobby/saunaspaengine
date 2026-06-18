/// <reference types="vitest/globals" />
import { render } from "@testing-library/react";
import { assertAccessible } from "./accessibility";
import ManualValidationForm from "@/components/operations/manual-validation-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("manual validation form accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<ManualValidationForm />);
    await assertAccessible(container);
  });
});
