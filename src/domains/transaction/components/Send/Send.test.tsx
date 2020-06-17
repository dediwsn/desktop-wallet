import { render } from "@testing-library/react";
import React from "react";

import { Send } from "./";

describe("Recipient", () => {
	it("should render", () => {
		const { container } = render(<Send />);
		expect(container).toMatchSnapshot();
	});
});
