import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skills from "../Skills";

describe("Skills section", () => {
  it("renders all skill category headings", () => {
    render(<Skills />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Frameworks & Libraries")).toBeInTheDocument();
    expect(screen.getByText("AI / ML")).toBeInTheDocument();
    expect(screen.getByText("Cloud & Infrastructure")).toBeInTheDocument();
  });

  it("renders individual skill pills", () => {
    render(<Skills />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("LangGraph")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });
});
