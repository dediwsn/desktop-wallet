import { render } from "@testing-library/react";
import React from "react";

import { VerifyMessageStatus } from "./VerifyMessageStatus";

describe("VerifyMessageStatus", () => {
	it("should render verify message success", () => {
		const { container, asFragment } = render(
			<VerifyMessageStatus title="Title" description="Description" type="success" isOpen={true} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render verify message error", () => {
		const { container, asFragment } = render(
			<VerifyMessageStatus title="Title" description="Description" type="error" isOpen={true} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
