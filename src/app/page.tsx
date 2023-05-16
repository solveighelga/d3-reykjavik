"use client";

import BarChart from "./components/BarChart";
import styles from "./page.module.css";

type DataType = {
	kyn: string;
	tegund: string;
	aldur: string;
	artal: number;
	fjoldi: number;
	hlutfall: number;
};

const data: DataType[] = [
	{
		kyn: "Karlar",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2007,
		fjoldi: 28,
		hlutfall: 0.0169082126,
	},
	{
		kyn: "Konur",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2007,
		fjoldi: 48,
		hlutfall: 0.0289855072,
	},
	{
		kyn: "Samtals",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2007,
		fjoldi: 76,
		hlutfall: 0.0458937198,
	},
	{
		kyn: "Karlar",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2008,
		fjoldi: 52,
		hlutfall: 0.0277185501,
	},
	{
		kyn: "Konur",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2008,
		fjoldi: 57,
		hlutfall: 0.0303837953,
	},
	{
		kyn: "Samtals",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2008,
		fjoldi: 109,
		hlutfall: 0.0581023454,
	},
	{
		kyn: "Karlar",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2009,
		fjoldi: 90,
		hlutfall: 0.0361881785,
	},
	{
		kyn: "Konur",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2009,
		fjoldi: 96,
		hlutfall: 0.0386007238,
	},
	{
		kyn: "Samtals",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2009,
		fjoldi: 186,
		hlutfall: 0.0747889023,
	},
	{
		kyn: "Karlar",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2010,
		fjoldi: 99,
		hlutfall: 0.0338577291,
	},
	{
		kyn: "Konur",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2010,
		fjoldi: 122,
		hlutfall: 0.0417236662,
	},
	{
		kyn: "Samtals",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2010,
		fjoldi: 221,
		hlutfall: 0.0755813953,
	},
];
const dataKarlar = data.filter((item) => item.kyn === "Karlar");

export default function Home() {
	const width= 872;
	const height= 662;
	return (
		<main className={styles.main}>
			<div>
				<h1>D3 Project for Reykjavík</h1>
			<BarChart
				title='Data Karlar'
				data={dataKarlar}
				summary='Fjárhagsaðstoð til framfærslu'
				xAccessor={(d) => {
					return d.artal.toString();
				}}
				yAccessor={(d) => {
					return d.fjoldi;
				}}
				options={{}}
			/>
			</div>
		</main>
	);
}
