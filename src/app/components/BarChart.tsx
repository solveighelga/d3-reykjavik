"use client";
//import './hideTable.css';
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import {hannaVars, srOnly, css} from '@reykjavik/hanna-css';

export interface xAxisOptions {
	/**unit of the y axis. Decorator in form of tuple.  (e.g. xAxisUnit: ["$", "M"] will show $1M)*/
	xAxisUnit?: [string, string];
	xAxisTickSize?: number;
	xAxisTickPadding?: number;
}
export interface yAxisOptions {
	/**unit of the y axis. Decorator in form of tuple.  (e.g. yAxisUnit: ["$", "M"] will show $1M)*/
	yAxisUnit?: [string, string];
	yAxisTickSize?: number;
	yAxisTickPadding?: number;
}

export interface BarChartOptions {
	/**width of the svg element*/
	width?: number;
	/**height of the svg element*/
	height?: number;
	/**margin of the svg element*/
	margin?: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	/**padding between the bars must be in the range [0, 1) 0 means no padding and 1 means no bars*/
	padding?: number | { inner: number; outer: number };
	/**unit of the y axis. Decorator in form of tuple.  (e.g. yAxisUnit: ["$", "M"] will show $1M)*/
	yAxisOptions?: yAxisOptions;
	xAxisOptions?: xAxisOptions;
}

export interface BarChartProps<T, K extends keyof T> {
	/**Dataset to be visualized.*/
	data: T[];
	/**Title of the chart.*/
	title: string;
	/**Summary of the chart.*/
	summary: string;
	/**Function to access the x value of the data. This function must return the x value as a string.If we work on data numbers please just convert them to string. (e.g. xAccessor: (d) => d.x.toString())*/
	xAccessor: (d: T) => T[K] extends string ? T[K] : any;
	/**X axis label*/
	xLabel: string;
	/**Y axis label*/
	yLabel: string;
	/**Function to access the y value of the data. This function should return a number.*/
	yAccessor: (d: T) => T[K] extends number ? T[K] : any;
	/**Options to customize the chart.*/
	options?: BarChartOptions;
}

export const BarChart = <T, K extends keyof T>({
	summary,
	title,
	data,
	xAccessor,
	yAccessor,
	xLabel,
	yLabel,
	options,
}: BarChartProps<T, K>) => {
	const [highContrast, setHighContrast] = useState(false);
	const handleChange = () => {
		setHighContrast(!highContrast);
	  };
	//used to make sure that Axis labels are not cut off
	const basePadding = 40;
	//taking options from the props and setting default values
	const {
		width = 872,
		height = 662,
		margin = { top: 50, right: 20, bottom: -30, left: -30 },
		padding = 0.3,
		yAxisOptions,
		xAxisOptions,
	} = options || {};
	console.log(summary);
	const chartWidth =
		width -
		margin.left -
		margin.right -
		(yAxisOptions?.yAxisTickPadding || 0) -
		basePadding * 2.5;
	const chartHeight =
		height - margin.top - basePadding - margin.bottom - basePadding * 2.5;

	const {
		yAxisUnit = ["", ""],
		yAxisTickSize = -chartWidth, // extending the tick to the length of the width
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
		.domain([0, (d3.max(data, yAccessor) || 0) * 1.1])
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
		.tickSizeInner(xAxisTickSize)
		.tickPadding(xAxisTickPadding)
		.tickFormat((d) => `${xAxisUnit[0]} ${d} ${xAxisUnit[1]}`)
		.tickSizeOuter(0);

	const yAxis = d3
		.axisLeft(yScale)
		.ticks(10)
		.tickSizeInner(yAxisTickSize)
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
				.style("padding", "none")
				.append("rect")
				.attr("class", "svg-background")
				.attr("width", width)
				.attr("height", height)
				.attr(
					"fill",
					highContrast
						? "var(--svgContainerColorHighContrast)"
						: "var(--svgContainerColor)"
				);

			//defining the chart canvas
			selection
				.append("rect")
				.attr("class", "chart-canvas")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.attr(
					"fill",
					highContrast
						? "var(--chartCanvasColorHighContrast)"
						: "var(--chartCanvasColor)"
				)
				.attr(
					"transform",
					`translate(${margin.left + basePadding * 2.5}, ${
						margin.top + basePadding
					})`
				);

			// X-axis label
			selection
				.append("text")
				.attr("class", "x-axis-label")
				.text("Ártal")
				.attr("x", chartWidth / 2 + margin.left + basePadding * 2.5) // Adjust the x position as needed
				.attr(
					"y",
					chartHeight +
						margin.top +
						basePadding +
						xAxisTickPadding +
						basePadding
				) // Adjust the y position as needed
				.attr("text-anchor", "middle")
				.attr(
					"fill",
					highContrast
						? "var(--svgTextColorHighContrast)"
						: "var(--svgTextColor)"
				);

			// Y-axis label
			selection
				.append("text")
				.text("Fjöldi á ári")
				.attr("class", "y-axis-label")
				.attr("x", -(chartHeight / 2) - margin.top - basePadding) // Adjust the Y(!) position as needed
				.attr("y", yAxisTickPadding + margin.left + 0.75 * basePadding) // Adjust the X(!) position as needed
				.attr("text-anchor", "middle")
				.attr("transform", `rotate(-90)`)
				.attr(
					"fill",
					highContrast
						? "var(--svgTextColorHighContrast)"
						: "var(--svgTextColor)"
				);

			selection
				.append("g")
				.call(yAxis)
				.attr("class", "x-axis")
				.attr("aria-hidden", "true")
				.style(
					"color",
					highContrast
						? "var(--yAxisTextColorHighContrast)"
						: "var(--yAxisTextColor)"
				)
				.attr(
					"transform",
					`translate(${margin.left + basePadding * 2.5}, ${
						margin.top + basePadding
					})`
				)
				.selectAll(".tick line")
				.attr(
					"stroke",
					highContrast
						? "var(--yAxisTickColorHighContrast)"
						: "var(--yAxisTickColor)"
				);

			selection.selectAll(".domain").attr("stroke", "none");

			selection
				.append("g")
				.selectAll("rect")
				//join the data to the selection
				.data(data)
				//for each data item that does not have a corresponding element in the selection, create a new element
				.enter()
				//append a rect element to the selection
				.append("rect")
				.attr("tabindex", "0")
				.attr("class", "bar")
				.attr("height", "0")
				.attr(
					"transform",
					`translate(${margin.left + basePadding * 2.5},-${
						margin.bottom + basePadding * 2.5
					})`
				)
				//.attr("y", chartHeight + margin.top +basePadding)
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
				.attr(
					"y",
					(d) =>
						chartHeight +
						margin.bottom +
						basePadding * 2.5 +
						margin.top +
						basePadding
				)
				.attr("width", xScale.bandwidth())
				//set the height of the rect element to the scaled value of the data
				.transition()
				.delay((d, i) => i * 100)
				.duration(600)
				.ease(d3.easeSinInOut)
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
				.attr(
					"y",
					(d) =>
						yScale(yAccessor(d)) +
						margin.top +
						basePadding +
						margin.bottom +
						basePadding * 2.5
				)
				.attr(
					"transform",
					`translate(${margin.left + basePadding * 2.5},-${
						margin.bottom + basePadding * 2.5
					})`
				)
				.attr("height", (d) => chartHeight - yScale(yAccessor(d)))
				//set the width of the rect element to 20 - constant
				//set the fill color of the rect element to blue
				.attr(
					"fill",
					highContrast
						? "var(--rectColorHighContrast)"
						: "var(--rectColor)"
				)
				.style(
					"stroke",
					highContrast
						? "var(--rectStrokeHighContrast)"
						: "var(--rectStroke)"
				)
				.style("stroke-width", "1");

			selection
				.append("g")
				.attr("class", "bar-label")
				.selectAll("text")
				//join the data to the selection
				.data(data)
				//for each data item that does not have a corresponding element in the selection, create a new element
				.enter()
				//append a rect element to the selection
				.append("text")
				.attr(
					"x",
					(d) =>
						xScale(xAccessor(d))! +
						xScale.bandwidth() / 2 +
						margin.left +
						basePadding * 2.5
				)
				.attr("text-anchor", "middle")
				.attr(
					"y",
					(d) => yScale(yAccessor(d))! + margin.top + basePadding - 5
				)

				.text(yAccessor);

			const xAxisGroup = selection
				.append("g")
				.attr("class", "x-axis")
				.attr("aria-hidden", "true")
				.style(
					"color",
					highContrast
						? "var(--xAxisTextColorHighContrast)"
						: "var(--xAxisTextColor)"
				)
				.style(
					"color",
					highContrast
						? "var(--xAxisTextColorHighContrast)"
						: "var(--xAxisTextColor)"
				)
				.attr(
					"transform",
					`translate(${margin.left + basePadding * 2.5}, ${
						chartHeight + margin.top + basePadding
					})`
				)
				.call(xAxis)
				.selectAll(".domain")
				.attr(
					"stroke",
					highContrast
						? "var(--xAxisTickColorHighContrast)"
						: "var(--xAxisTickColor)"
				);
		}
	}, [selection, highContrast, options, data]);

	const crateTable = (
		data: T[],
		xAccessor: (d: T) => string,
		yAccessor: (d: T) => number,
		xLabel: string,
		yLabel: string
	) => {
		return (
			<table className="sr-only">
				<thead >
					<tr>
						<th>{xLabel}</th>
						<th>{yLabel}</th>
					</tr>
				</thead>
				<tbody>
					{data!.map((d, i) => (
						<tr key={`${i}-${d}`}>
							<td>{xAccessor(d)}</td>
							<td>{yAccessor(d)}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};


	return (
		<div className='BarChart__container'>

			{/* Checkbox to switch change the state of the chart from low contrast to high contrast */}
			<div className="checkboxContainer">
				<input 
					type="checkbox"
					checked={highContrast}
					onChange={handleChange}
					className="inputContrast"
				/>
				<label className="checkboxLabel">
					High Contrast
				</label>
				
			</div>

			<h2 className='BarChart__title'>{title}</h2>
			<desc id='chartSummary'>{summary}</desc>
			<svg
				ref={svgRef}
				role='figure'
				aria-labelledby='chartSummary'
				tabIndex={1}
			/>
			{crateTable(data, xAccessor, yAccessor, xLabel, yLabel)}
		</div>
	);
};