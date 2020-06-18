import { Address } from "app/components/Address";
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
import { Table } from "app/components/Table";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "twin.macro";

import { defaultStyle } from "./Send.styles";

const FormWrapper = styled.div`
	${defaultStyle}
`;

type SendProps = {
	maxAvailableAmount: number;
	contactList: any;
	senderList: any;
	formDefaultData: any;
	networks: any;
	feeRange: any;
	defaultFee: number;
	maxFee: number;
	onContinue: any;
	onBack: any;
	assetSymbol: string;
};

type RecipientListItem = {
	amount: number;
	address: string;
	walletName: string;
	assetSymbol: string;
	onRemove: any;
};

export const RecipientListItem = ({ amount, address, walletName, assetSymbol, onRemove }: RecipientListItem) => (
	<tr className="border-b border-theme-neutral-200">
		<td className="w-12 py-4">
			<Circle avatarId="test" size="small"></Circle>
		</td>
		<td>
			<Address address={address} walletName={walletName}></Address>
		</td>

		<td className="font-bold text-theme-neutral-800 text-right">
			{amount} {assetSymbol}
		</td>
		<td className="text-right w-16">
			<Button color="primary" variant="plain" onClick={onRemove}>
				<div className="py-1">
					<Icon name="Trash"></Icon>
				</div>
			</Button>
		</td>
	</tr>
);

export const Send = ({
	feeRange,
	networks,
	maxAvailableAmount,
	formDefaultData,
	contactList,
	senderList,
	maxFee,
	onContinue,
	onBack,
	assetSymbol,
}: SendProps) => {
	const form = useForm({
		defaultValues: formDefaultData,
	});

	const { setValue, register } = form;
	const { network, fee, sender, recipient, amount } = form.watch();
	const feeRangeValue = useRadioState(0);

	const onSubmit = () => void 0;

	// Add background color to `Send All` to cover the input number browser built-in arrows
	const sendAllBgClass = network ? "bg-theme-background" : "bg-theme-neutral-100";

	const onClickContinue = () => {
		if (onContinue === "function") onContinue();
	};

	const onClickBack = () => {
		if (onBack === "function") onBack();
	};

	const getProfileInfo = (address: string) => {
		const profiles = [...contactList, ...senderList];
		return profiles.find((profile: any) => profile.address === address);
	};

	const getNetwork = (networkValue: string) => {
		const selected = networks.find((network: any) => network.value === networkValue);
		return selected;
	};

	const [addedRecipients, setAddressRecipients] = useState([]);

	const onAddRecipient = (recipient: string, amount: number) => {
		const { walletName, address } = getProfileInfo(recipient);
		const newRecipients = addedRecipients.concat();
		newRecipients.push({ amount, walletName, address });
		setAddressRecipients(newRecipients);

		// Remove recipient from available contacts list
		// Reset values
		form.setValue("amount", 0);
		form.setValue("recipient", null);
	};

	const onRemoveRecipient = (address: string) => {
		const index = addedRecipients.findIndex((addedRecipient: any) => addedRecipient.address === address);
		const newRecipients = addedRecipients.concat();
		newRecipients.splice(index, 1);
		setAddressRecipients(newRecipients);
	};

	const availableContacts = contactList.filter((contact: any) => {
		if (addedRecipients.length === 0) return true;
		const added = addedRecipients.map(({ address }: any) => address);
		return !added.includes(contact.address);
	});

	return (
		<FormWrapper>
			<h2>Send</h2>
			<p className="mb-4 text-theme-neutral-600">Enter details to send your money</p>

			<Form id="send-transaction__form" context={form} onSubmit={onSubmit}>
				<FormField name="network" className="relative mt-1 h-20">
					<div className="mb-2">
						<FormLabel label="Network" />
					</div>
					<div className=" select-transparent">
						<Select placeholder=" " name="network" ref={register}>
							{networks &&
								networks.map((network: any, index: number) => (
									<option key={index} value={network.value}>
										{network.label}
									</option>
								))}
						</Select>
					</div>

					{!network && (
						<div className="absolute -mt-10 ml-4">
							<Circle className="border-theme-neutral-200" size="small" noShadow />
						</div>
					)}
					{network && (
						<div className="-mt-10 flex items-center mt-10 ml-4">
							<Circle className={getNetwork(network).iconClassName} size="small" noShadow>
								<Icon name={getNetwork(network).icon} width={18} height={18} />
							</Circle>
							<div className="text-theme-neutral-800 font-semibold ml-4">{getNetwork(network).label}</div>
						</div>
					)}
				</FormField>

				<FormField name="sender" className="relative mt-1 h-20">
					<div className="mb-2">
						<FormLabel label="Sender" />
					</div>

					<InputGroup className="send-transaction__select-contact select-transparent">
						<Select disabled={!network} placeholder=" " name="sender" ref={register}>
							{senderList &&
								senderList.map((sender: any, index: number) => (
									<option key={index} value={sender.address}>
										{sender.formatted}
									</option>
								))}
						</Select>
						<InputAddonEnd>
							<button className="px-3 pr-2 text-theme-primary-300 focus:outline-none">
								<Icon name="User" width={20} height={20}></Icon>
							</button>
							<Divider type="vertical" />
							<button className="pr-4 pl-2 text-theme-primary-300 focus:outline-none">
								<Icon name="Receive" width={20} height={20}></Icon>
							</button>
						</InputAddonEnd>
					</InputGroup>

					{!sender && (
						<div className="absolute -mt-10 ml-4">
							<Circle
								className="bg-theme-neutral-200 border-theme-neutral-200 mt-px"
								size="small"
								noShadow
							/>
						</div>
					)}
					{sender && (
						<div className="-mt-10 flex ml-4">
							<Circle
								avatarId={getProfileInfo(sender)?.address}
								className="bg-theme-neutral-300 border-theme-neutral-300"
								size="small"
								noShadow
							/>
							<div className="text-theme-neutral-800 font-semibold ml-4 mt-1">
								<Address
									maxChars={30}
									address={getProfileInfo(sender)?.address}
									walletName={getProfileInfo(sender)?.walletName}
								></Address>
							</div>
						</div>
					)}
				</FormField>
				<FormField name="recipient" className="relative mt-1 h-20">
					<div className="mb-2">
						<FormLabel label="Recipient" />
					</div>
					<InputGroup className="send-transaction__select-contact select-transparent">
						<Select disabled={!network} placeholder=" " ref={register}>
							{availableContacts &&
								availableContacts.map((contact: any, index: number) => (
									<option key={index} value={contact.address}>
										{contact.formatted}
									</option>
								))}
						</Select>
						<InputAddonEnd>
							<button className="px-3 pr-2 text-theme-primary-300 focus:outline-none">
								<Icon name="User" width={20} height={20}></Icon>
							</button>
							<Divider type="vertical" />
							<button className="pr-4 pl-2 text-theme-primary-300 focus:outline-none">
								<Icon name="Receive" width={20} height={20}></Icon>
							</button>
						</InputAddonEnd>
					</InputGroup>

					{!recipient && (
						<div className="absolute -mt-10 ml-4">
							<Circle
								className="bg-theme-neutral-200 border-theme-neutral-200 mt-px"
								size="small"
								noShadow
							/>
						</div>
					)}
					{recipient && (
						<div className="-mt-10 flex ml-4">
							<Circle
								avatarId={getProfileInfo(recipient)?.address}
								className="bg-theme-neutral-300 border-theme-neutral-300"
								size="small"
								noShadow
							/>
							<div className="text-theme-neutral-800 font-semibold ml-4 mt-1">
								<Address
									maxChars={30}
									address={getProfileInfo(recipient)?.address}
									walletName={getProfileInfo(recipient)?.walletName}
								></Address>
							</div>
						</div>
					)}
				</FormField>

				<FormField name="amount" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Amount ARK" />
					</div>
					<InputGroup>
						<Input
							type="number"
							name="amount"
							placeholder="Amount"
							className="pr-20"
							ref={register}
							disabled={!network}
						/>
						<InputAddonEnd>
							<button
								onClick={() => setValue("amount", maxAvailableAmount)}
								className={`pr-4 pl-6 text-theme-primary bg-theme-background focus:outline-none ${sendAllBgClass}`}
							>
								Send All
							</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>

				{amount > 0 && !!recipient && (
					<Button
						color="primary"
						variant="plain"
						className="w-full"
						onClick={() => onAddRecipient(recipient, amount)}
					>
						Add Recipient{" "}
					</Button>
				)}

				{addedRecipients.length > 0 && (
					<div className="pt-6">
						<div className="text-sm font-semibold text-theme-neutral-700 mb-4">Recipients</div>
						<Table
							columns={[
								{ Header: "Avatar", className: "invisible w-2" },
								{ Header: "Address" },
								{ Header: "Amount", className: "float-right" },
								{ Header: "Action", className: "invisible" },
							]}
							data={addedRecipients}
						>
							{(addedRecipient: any) => (
								<RecipientListItem
									assetSymbol={assetSymbol}
									amount={addedRecipient.amount}
									address={addedRecipient.address}
									walletName={addedRecipient.walletName}
									onRemove={() => onRemoveRecipient(addedRecipient.address)}
								/>
							)}
						</Table>
					</div>
				)}

				<FormField name="smartbridge" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label="Smartbridge" />
					</div>
					<InputGroup>
						<Input type="text" placeholder=" " className="pr-20" maxLength={255} disabled={!network} />
						<InputAddonEnd>
							<button className="px-4 text-theme-neutral-400 focus:outline-none">255 Max</button>
						</InputAddonEnd>
					</InputGroup>
				</FormField>
				<div className="flex">
					<div className="w-2/4">
						<FormField name="fee" className="relative mt-1">
							<div className="mb-2">
								<FormLabel label="Fee ARK" />
								<InputRange ref={register} defaultValue={fee} min={0} max={maxFee} step={0.01} />
							</div>
						</FormField>
					</div>
					<div className="w-2/4 mt-7 text-right">
						<RadioButtonGroup>
							<RadioButton value={feeRange.last} {...feeRangeValue}>
								<span onClick={() => setValue("fee", feeRange.last)}>Last</span>
							</RadioButton>
							<RadioButton value={feeRange.min} {...feeRangeValue}>
								<span onClick={() => setValue("fee", feeRange.min)}>Min</span>
							</RadioButton>
							<RadioButton value={feeRange.average} {...feeRangeValue}>
								<span onClick={() => setValue("fee", feeRange.average)}>Average</span>
							</RadioButton>
						</RadioButtonGroup>
					</div>
				</div>
				<div className="flex items-center">
					<Button color="primary" variant="plain" size="large" onClick={onClickBack} disabled={!network}>
						Back
					</Button>
					<Button
						color="primary"
						variant="solid"
						size="large"
						className="ml-5"
						onClick={onClickContinue}
						disabled={!network}
					>
						Continue
					</Button>
				</div>
			</Form>
		</FormWrapper>
	);
};

Send.defaultProps = {
	maxFee: 100,
	maxAvailableAmount: 80,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	networks: [
		{
			value: "ark",
			label: "Ark Ecosystem",
			icon: "Ark",
			iconClassName: "border-theme-danger-200 text-theme-danger-400",
		},
	],
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	senderList: [
		{
			address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "My Wallet",
			avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
	],
	contactList: [
		{
			address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient Wallet",
			formatted: "Recipient Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
		{
			address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient Multisig",
			formatted: " Recipient Multisig AhFJKDSALJFKA...SAJFKLASJKDFJ",
			isMultisig: true,
		},
		{
			address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient in Ark",
			formatted: "Recipient in Ark FAhFJKDSALJFK...SAJFKLASJKDFJ",
			isInArkNetwork: true,
		},
	],
};
