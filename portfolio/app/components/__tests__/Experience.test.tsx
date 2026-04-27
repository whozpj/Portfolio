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
    expect(screen.getByText(/automated failover/)).toBeInTheDocument();
  });

  it("clicking a collapsed row shows its bullets", () => {
    render(<Experience />);
    const candlefish = screen.getByText("Candlefish").closest("[data-role='exp-row']");
    expect(candlefish).not.toBeNull();
    fireEvent.click(candlefish!.querySelector("button")!);
    expect(screen.getByText(/200\+ hour manual labeling/)).toBeInTheDocument();
  });

  it("clicking an open row hides its bullets", () => {
    render(<Experience />);
    const mantech = screen.getByText("ManTech").closest("[data-role='exp-row']");
    expect(mantech).not.toBeNull();
    fireEvent.click(mantech!.querySelector("button")!);
    expect(screen.queryByText(/automated failover/)).not.toBeInTheDocument();
  });
});
