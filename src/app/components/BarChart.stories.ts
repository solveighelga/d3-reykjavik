import type { Meta, StoryObj } from "@storybook/react";
import { dataKarlar, DataTypeA } from "./dataset1";
import { BarChart, BarChartProps } from "./BarChart";

const meta = {
	title: "Example/BarChart",
	component: BarChart,
	tags: ["autodocs"],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story<T, K extends keyof T> = StoryObj<BarChartProps<T, K>>;

export const Primary: Story<DataTypeA, "artal"> = {
	args: {
		title: "BarChart",
		summary: "This is a BarChart",
		data: dataKarlar,
		xAccessor: (d) => {
			return d.artal.toString();
		},
		yAccessor: (d) => {
			return d.fjoldi;
		},
	},
};
