import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { AskGaurav } from "~/components/AskGaurav";
import { RiceTool } from "~/components/tools/Rice";

afterEach(() => { cleanup(); sessionStorage.clear(); });
const mount = (C: () => React.JSX.Element) => { const Stub = createRoutesStub([{ path: "/", Component: C }]); return render(<Stub initialEntries={["/"]} />); };
const flush = () => new Promise((r) => setTimeout(r, 30));

describe("<AskGaurav />", () => {
  it("answers a suggested question with sources", async () => {
    mount(() => <AskGaurav />);
    fireEvent.click(screen.getByRole("button", { name: "Tell me about Evamastu." }));
    await flush();
    const ans = await screen.findByTestId("ask-answer");
    expect(ans.textContent).toContain("20–25%");
    expect(within(ans).getByRole("link", { name: "Evamastu case study" })).toBeTruthy();
  });
  it("refuses an unsupported question and validates empty input", async () => {
    mount(() => <AskGaurav />);
    fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "How many users does Aaroh have?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await flush();
    expect((await screen.findByTestId("ask-refused")).textContent).toMatch(/no live users/);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("alert").textContent).toBe("Type a question first.");
  });
});

describe("<RiceTool />", () => {
  it("adds, scores, invalidates and removes rows", async () => {
    mount(() => <RiceTool />);
    await flush();
    expect(screen.getAllByTestId("rice-score")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Add feature" }));
    expect(screen.getAllByTestId("rice-score")).toHaveLength(4);
    fireEvent.change(screen.getByLabelText("Effort for New feature"), { target: { value: "0" } });
    expect(screen.getAllByTestId("rice-score").map((e) => e.textContent)).toContain("—");
    fireEvent.click(screen.getByRole("button", { name: "Remove New feature" }));
    expect(screen.getAllByTestId("rice-score")).toHaveLength(3);
  });
});
