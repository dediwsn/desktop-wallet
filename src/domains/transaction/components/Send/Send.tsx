import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd, InputGroup } from "app/components/Input";
import { InputRange } from "app/components/Input/InputRange";
import { RadioButton, RadioButtonGroup } from "app/components/RadioButton";
import { useRadioState } from "app/components/RadioButton/useRadioState";
import { Select } from "app/components/Select";
import React from "react";
import { useForm } from "react-hook-form";
import { styled } from "twin.macro";

import { defaultStyle } from "./Send.styles";

const FormWrapper = styled.div`
	${defaultStyle}
`;

export const Send = () => {
	const form = useForm();
	const feeRange = useRadioState(1);
	const onSubmit = () => void 0;

	return (
		<FormWrapper>
			<h2>Send</h2>
			<p className="mb-4 text-theme-neutral-600">Enter details to send your money</p>

			<Form id="send-transaction__form" context={form} onSubmit={onSubmit}>
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Network" />
					</div>
					<Select placeholder=" " className="send-transaction__select-network">
						<option value="ark">Ark Ecosystem</option>
					</Select>
					<div className="absolute top-0 flex items-center mt-10 ml-4">
						<Circle className="border-theme-neutral-200" size="small" noShadow />
						<span className="ml-3 font-semibold "></span>
					</div>
				</FormField>
				<FormField name="sender" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Sender" />
					</div>

					<InputGroup>
						<Input type="text" disabled />
						<InputAddonEnd>
							<button className="px-3 pr-2 text-theme-primary-300 focus:outline-none">
								<Icon name="User" width={20} height={20}></Icon>
							</button>
							<Divider type="vertical" />
							<button className="pr-4 pl-2 text-theme-primary-300 focus:outline-none">
								<Icon name="Receive" width={20} height={20}></Icon>
							</button>
						</InputAddonEnd>
						<div className="absolute top-0 flex items-center mt-2 ml-4">
							<Circle className="bg-theme-neutral-300 border-theme-neutral-300" size="small" noShadow />
							<span className="ml-3 font-semibold "></span>
						</div>
					</InputGroup>
				</FormField>
				<FormField name="recipient" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Recipient" />
					</div>
					<InputGroup>
						<Input type="text" disabled />
						<InputAddonEnd>
							<button className="px-3 pr-2 text-theme-primary-300 focus:outline-none">
								<Icon name="User" width={20} height={20}></Icon>
							</button>
							<Divider type="vertical" />
							<button className="pr-4 pl-2 text-theme-primary-300 focus:outline-none">
								<Icon name="Receive" width={20} height={20}></Icon>
							</button>
						</InputAddonEnd>
						<div className="absolute top-0 flex items-center mt-2 ml-4">
							<Circle className="bg-theme-neutral-300 border-theme-neutral-300" size="small" noShadow />
							<span className="ml-3 font-semibold "></span>
						</div>
					</InputGroup>
				</FormField>

				<FormField name="recipient" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Amount ARK" />
					</div>
					<InputGroup>
						<Input type="number" placeholder="Amount" className="pr-20" />
						<InputAddonEnd>
							<button className="pr-4 pl-6 text-theme-primary bg-theme-background focus:outline-none">
								Send All
							</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>

				<FormField name="recipient" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Smartbridge" />
					</div>
					<InputGroup>
						<Input type="text" placeholder="Amount" className="pr-20" maxLength={255} />
						<InputAddonEnd>
							<button className="px-4 text-theme-neutral-400 focus:outline-none">255 Max</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>
				<div className="flex">
					<div className="w-2/4">
						<FormField name="recipient" className="relative mt-1">
							<div className="mb-2">
								<FormLabel label="Fee ARK" />
								<InputRange defaultValue={0.0} min={0} max={100} step={0.01} />
							</div>
						</FormField>
					</div>
					<div className="w-2/4 mt-7 text-right">
						<RadioButtonGroup>
							<RadioButton value={1} {...feeRange}>
								Last
							</RadioButton>
							<RadioButton value={2} {...feeRange}>
								Min
							</RadioButton>
							<RadioButton value={3} {...feeRange}>
								Average
							</RadioButton>
						</RadioButtonGroup>
					</div>
				</div>
				<div className="flex items-center">
					<Button color="primary" variant="plain" size="large">
						Back
					</Button>
					<Button color="primary" variant="solid" size="large" className="ml-5">
						Continue
					</Button>
				</div>
			</Form>
		</FormWrapper>
	);
};
