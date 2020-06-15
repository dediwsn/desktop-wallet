import { render } from "@testing-library/react";
import React from "react";

import { StepIndicator } from "./";

describe("StepIndicator", () => {
	it("should render", () => {
		const { container, asFragment } = render(<StepIndicator />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});