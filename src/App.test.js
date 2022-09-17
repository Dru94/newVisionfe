import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import Home from "./components/home";
import axios from "axios";

jest.mock("axios");

const dummyData = [
  {
    id: 1,
    title: "English Language & Literature in English",
    subject: "English",
    class_number: "One",
    level: "SENIOR",
    cost: 25000,
    teachers_guide: 20000,
  },
  {
    id: 2,
    title: "English Language & Literature in English",
    subject: "English",
    class_number: "Two",
    level: "SENIOR",
    cost: 25000,
    teachers_guide: 20000,
  },
  {
    id: 3,
    title: "Mathematics",
    subject: "Mathematics",
    class_number: "Two",
    level: "SENIOR",
    cost: 25000,
    teachers_guide: 20000,
  },
  {
    id: 4,
    title: "Mathematics",
    subject: "Mathematics",
    class_number: "One",
    level: "SENIOR",
    cost: 25000,
    teachers_guide: 20000,
  },
];

test("renders books list", async () => {
  axios.get.mockResolvedValue({ data: dummyData });
  render(<Home />);

  const subjectList = await waitFor(() => screen.findAllByTestId("subjects"));
  expect(subjectList).toHaveLength(4);
});
