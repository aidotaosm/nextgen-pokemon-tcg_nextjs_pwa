import { render, screen } from "@testing-library/react";
import { AppWrapper } from "./AppWrapper";

test("renders learn react link", () => {
  render(<AppWrapper></AppWrapper>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
