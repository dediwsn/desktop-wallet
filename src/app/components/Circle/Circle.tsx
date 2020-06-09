import { styled } from "twin.macro";
import { getStyles } from "./style";

type CircleProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	avatarId?: string | null;
	size?: "small" | "default";
	className?: string | null;
};

export const Circle = styled.div<CircleProps>(getStyles);

Circle.defaultProps = {
	size: "default",
};
