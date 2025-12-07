import { render } from "@testing-library/react";
import Header from "../components/header/Header";

it("renders selected contacts counter", () => {
  const { getByText } = render(
    <Header selectedCount={10}/>
  );

  expect(getByText("Selected contacts: 10"));
});
