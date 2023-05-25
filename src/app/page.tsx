"use client";

import { BarChart } from "./components/BarChart";
import styles from "./page.module.css";
import { dataKarlar } from "./components/dataset1";

export default function Home() {
	return (
		<main className={styles.main}>
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
				xLabel='Ár'
				yLabel='Fjöldi'
				options={{}}
			/>
		</main>
	);
}
