import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { ProfileCreated } from "./";

export default { title: "Profile / Components / Profile Created" };

export const Default = () => (
	<ProfileCreated
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onSkip={() => alert("skipped")}
		onStart={() => alert("started")}
	/>
);