import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Projects from "../Projects";

describe("Projects section", () => {
  it("renders all three projects", () => {
    render(<Projects />);
    expect(screen.getByText("Argus")).toBeInTheDocument();
    expect(screen.getByText("GitGuard")).toBeInTheDocument();
    expect(screen.getByText("FeatherDB")).toBeInTheDocument();
  });

  it("renders GitHub link for FeatherDB", () => {
    render(<Projects />);
    const link = screen.getByRole("link", { name: /GITHUB/i });
    expect(link).toHaveAttribute("href", "https://github.com/whozpj/featherdb");
  });

  it("renders tags for projects", () => {
    render(<Projects />);
    expect(screen.getAllByText(/Python/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/LangGraph/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Java/i).length).toBeGreaterThan(0);
  });
});
