import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { translations as WALLETS } from "../../i18n";
import { LedgerWallet } from "./LedgerWallet";

describe("LedgerWallet", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<LedgerWallet isOpen={false} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<LedgerWallet isOpen={true} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_LEDGER_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_LEDGER_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(WALLETS.MODAL_LEDGER_WALLET.WAITING_FOR_LEDGER);
		expect(asFragment()).toMatchSnapshot();
	});
});
