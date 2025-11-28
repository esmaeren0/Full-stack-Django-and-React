import { render, screen } from "./helpers/test-utils";
import App from "./App";

test("renders StayBooker welcome text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to StayBooker!/i);
  expect(linkElement).toBeInTheDocument();
});
