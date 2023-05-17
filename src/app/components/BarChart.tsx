"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export interface xAxisOptions {
	//unit of the y axis. Decorator in form of tuple.  (e.g. xAxisUnit: ["$", "M"] will show $1M)
	xAxisUnit?: [string, string];
	xAxisTickSize?: number;
	xAxisTickPadding?: number;
}
export interface yAxisOptions {
	//unit of the y axis. Decorator in form of tuple.  (e.g. yAxisUnit: ["$", "M"] will show $1M)
	yAxisUnit?: [string, string];
	yAxisTickSize?: number;
	yAxisTickPadding?: number;
}

export interface BarChartOptions {
	//width of the svg element
	width?: number;
	//height of the svg element
	height?: number;
	//margin of the svg element
	margin?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	//padding between the bars must be in the range [0, 1) 0 means no padding and 1 means no bars
	padding?: number | { inner: number; outer: number };
	//unit of the y axis. Decorator in form of tuple.  (e.g. yAxisUnit: ["$", "M"] will show $1M)
	yAxisOptions?: yAxisOptions;
	xAxisOptions?: xAxisOptions;
}

interface BarChartProps<T> {
	//Dataset to be visualized.
	data: T[];
	//Title of the chart.
	title: string;
	//Summary of the chart.
	summary: string;
	//Function to access the x value of the data. This function must return the x value as a string.If we work on data numbers please just convert them to string. (e.g. xAccessor: (d) => d.x.toString())
	xAccessor: (d: T) => string;
	//Function to access the y value of the data. This function should return a number.
	yAccessor: (d: T) => number;
	//Options to customize the chart.
	options?: BarChartOptions;
}

const BarChart = <T, K>({
	summary,
	title,
	data,
	xAccessor,
	yAccessor,
	options,
}: BarChartProps<T>) => {
	//taking options from the props and setting default values
	const {
		width = 872,
		height = 662,
		margin = { top: 40, right: 20, bottom: 60, left: 60 },
		padding = 0.3,
		yAxisOptions,
		xAxisOptions,
	} = options || {};
	console.log(summary)
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	const {
		yAxisUnit = ["", ""],
		yAxisTickSize = - chartWidth, // extending the tick to the length of the width
		yAxisTickPadding = 16, // padding between numbers and ticks
	} = yAxisOptions || {};
	const {
		xAxisUnit = ["", ""],
		xAxisTickSize = 0, // no ticks will appear on the graph
		xAxisTickPadding = 16, // padding between numbers and ticks
	} = xAxisOptions || {};
	//calculating the chart area width and height

	//either serving different padding values for inner and outer or just one value for both
	const paddingObj =
		typeof padding === "number"
			? { inner: padding, outer: padding }
			: padding;

	//define a ref to the svg element
	// const divRef = useRef<HTMLDivElement | null>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);

	//define a state to hold the selection
	const [selection, setSelection] = useState<null | d3.Selection<
		SVGSVGElement | null,
		unknown,
		null,
		undefined
	>>(null);

	//define a YScale to scale the data to the svg canvas height
	const yScale = d3
		.scaleLinear()
		//define the domain of the scale first number of the domain is the minimum value of the data and the second number is the maximum value of the data
		.domain([0, d3.max(data, yAccessor) || 0])
		//define the range of the scale first number of the range is the minimum value of the svg and the second number is the maximum value of the svg. Svg canvas is mapped from top to bottom and left to right. So the minimum value of the svg is the height of the svg and the maximum value of the svg is 0 to make bars appear from the bottom
		.range([chartHeight, 0]);

	//define a XScale to scale the data to the svg canvas width
	const xScale = d3
		.scaleBand()
		//define the domain of the scale as the x values of the data. Keys of objects must
		.domain(data.map(xAccessor))
		//define the range of the scale first number of the range is the minimum value of the svg and the second number is the maximum value of the svg. Svg canvas is mapped from top to bottom and left to right. So the minimum value of the svg is 0 and the maximum value of the svg is the width of the svg
		.range([0, chartWidth])
		//define the padding between the bars
		.paddingInner(paddingObj.inner)
		//define the padding between the bars and the svg
		.paddingOuter(paddingObj.outer);

	//define the axis
	const xAxis = d3
		.axisBottom(xScale)
		.tickSize(xAxisTickSize)
		.tickPadding(xAxisTickPadding)
		.tickFormat((d) => `${xAxisUnit[0]} ${d} ${xAxisUnit[1]}`);

	const yAxis = d3
		.axisLeft(yScale)
		.ticks(10)
		.tickSize(yAxisTickSize)
		.tickPadding(yAxisTickPadding)
		.tickFormat((d) => `${yAxisUnit[0]} ${d} ${yAxisUnit[1]}`);

		

	



	//all magic happens here
	useEffect(() => {
		if (!selection) {
			setSelection(d3.select(svgRef.current));
		} else {
			//defining the chart container
			selection
				.attr("class", "svg-container")
				.attr("width", width)
				.attr("height", height)
				.append("rect")
				.attr("class", "svg-background")
				.attr("width", width)
				.attr("height", height)
				.attr("fill", "#fff");


			// Y-axis ticks
			selection
				.selectAll(".y-axis .tick line")
				//.style("fill", "red"); // Set the desired color

			//defining the chart canvas
			selection
				.append("rect")
				.attr("class", "chart-canvas")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.attr("fill", "white")
				.attr("transform", `translate(${margin.left}, ${margin.top})`);

			// X-axis text
			selection
				.append("text")
				.text("Ártal")
				.attr("x", chartWidth / 2 + margin.left) // Adjust the x position as needed
				.attr(
					"y",
					chartHeight - margin.top + xAxisTickPadding + xAxisTickSize + 96
				) // Adjust the y position as needed
				.attr("text-anchor", "middle")
				.attr("fill", "black");

			// Y-axis text
			selection
				.append("text")
				.text("Fjöldi á ári")
				.attr("x", -(chartHeight / 2)) // Adjust the x position as needed
				.attr("y", yAxisTickPadding) // Adjust the y position as needed
				.attr("text-anchor", "middle")
				.attr("transform", `rotate(-90)`);

			selection
				.append("g")
				.call(yAxis)
				.attr("class", "x-axis")
				.style('color', 'rgba(114, 116, 119, 1)')
				.attr("transform", `translate(${margin.left}, ${margin.top})`)
				.selectAll('.tick line')
				.attr("stroke", "rgba(227, 229, 231, 1)");

			selection
				.selectAll('.domain')
				.attr('stroke', 'none');

			
			selection
				.append("g")
				.selectAll("rect")
				//join the data to the selection
				.data(data)
				//for each data item that does not have a corresponding element in the selection, create a new element
				.enter()
				//append a rect element to the selection
				.append("rect")
				.attr("class", "bar")
				.attr("height", "0")
				.attr("transform", `translate(${margin.left},-${margin.bottom})`)
				.attr("y", chartHeight + margin.top)
				.attr("width", xScale.bandwidth())
				//set the height of the rect element to the scaled value of the data
				.attr("x", (d) => {
					//instead of this block of code we can use bang operator since we know that devs are not going to pass null values
					const x = xScale(xAccessor(d));
					if (x) {
						return x;
					}
					return null;
					//as it is here
					//xScale(xAccessor(d))!;
				})
				//set the y position of the rect element to the scaled value of the data
				.attr("y", (d) => chartHeight + margin.bottom + margin.top)
				.attr("width", xScale.bandwidth())
				//set the height of the rect element to the scaled value of the data
				.transition()
				.delay((d, i) => i * 100)
				.duration(1000)
				.ease(d3.easeBounce)
				.attr("width", xScale.bandwidth())
				//set the height of the rect element to the scaled value of the data
				.attr("x", (d) => {
					//instead of this block of code we can use bang operator since we know that devs are not going to pass null values
					const x = xScale(xAccessor(d));
					if (x) {
						return x;
					}
					return null;
					//as it is here
					//xScale(xAccessor(d))!;
				})
				//set the y position of the rect element to the scaled value of the data
				.attr("y", (d) => yScale(yAccessor(d)) + margin.top + margin.bottom)
				.attr("transform", `translate(${margin.left},-${margin.bottom})`)
				.attr("height", (d) => chartHeight - yScale(yAccessor(d)))
				//set the width of the rect element to 20 - constant

				//set the fill color of the rect element to blue
				.attr("fill", "rgba(3, 103, 225, 1)")
				.style("stroke", "rgba(42, 43, 44, 1)")
				.style("stroke-width", "1");



				// .append("text")
				// 	.text((d) => d)
				// 	.attr("x", (d) => xScale(xAccessor(d)) + xScale.bandwidth() / 2)
				// 	.attr("y", (d) => yScale(yAccessor(d)) + margin.top + margin.bottom)
				// 	.attr("text-anchor", "middle")
				// 	.attr("fill", "black");


			const xAxisGroup = selection
				.append("g")
				.attr("class", "x-axis")
				.style('color', 'rgba(114, 116, 119, 1)')
				.attr(
					"transform",
					`translate(${margin.left}, ${chartHeight + margin.top})`
				)
				.call(xAxis)
				.selectAll('.domain')
				.attr('stroke', 'rgba(114, 116, 119, 1)');
		}
	}, [selection]);

	return <>
	        <h1>{summary}</h1>
			<h2>{title}</h2>
	        <svg ref={svgRef} />
			</>;
};

const addRandomData = () => {
	const dataToBeAdded = {
		xValue: prompt("Enter the value for x axis"),
		yValue: prompt("Enter the value for y axis"),
	};
};

export default BarChart;