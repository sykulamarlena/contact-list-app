import { render } from "@testing-library/react";
import InfoCard from "../components/card/InfoCard";
import mockData from "../mockData.json";

it("renders card with person info", () => {
  const { getByText } = render(
    <InfoCard data={mockData[0]} selected={false} onToggle={() => {}}/>
  );

  expect(getByText(mockData[0].firstNameLastName));
  expect(getByText(mockData[0].jobTitle));
  expect(getByText(mockData[0].emailAddress));
});