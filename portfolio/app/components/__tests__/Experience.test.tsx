import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Experience from "../Experience";

describe("Experience accordion", () => {
  it("renders all three companies", () => {
    render(<Experience />);
    expect(screen.getByText("ManTech")).toBeInTheDocument();
    expect(screen.getByText("Candlefish")).toBeInTheDocument();
    expect(screen.getByText("MyEdMaster")).toBeInTheDocument();
  });

  it("ManTech bullets are visible by default", () => {
    render(<Experience />);
    expect(screen.getByText(/Built 4 prod Django/)).toBeInTheDocument();
  });

  it("clicking a collapsed row shows its bullets", () => {
    render(<Experience />);
    const candlefish = screen.getByText("Candlefish").closest("[data-role='exp-row']")!;
    fireEvent.click(candlefish);
    expect(screen.getByText(/200\+ hour manual labeling/)).toBeInTheDocument();
  });

  it("clicking an open row hides its bullets", () => {
    render(<Experience />);
    const mantech = screen.getByText("ManTech").closest("[data-role='exp-row']")!;
    fireEvent.click(mantech);
    expect(screen.queryByText(/Built 4 prod Django/)).not.toBeInTheDocument();
  });
});
