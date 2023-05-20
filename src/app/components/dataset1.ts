export type DataTypeA = {
	kyn: string;
	tegund: string;
	aldur: string;
	artal: number;
	fjoldi: number;
	hlutfall: number;
};

const data: DataTypeA[] = [
	{
		kyn: "Karlar",
		tegund: "Fjárhagsaðstoð til framfærslu",
		aldur: "18-19 ára",
		artal: 2007,
		fjoldi: 2800,
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
		fjoldi: 5200,
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
		fjoldi: 9000,
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
		fjoldi: 9900,
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
export const dataKarlar = data.filter((item) => item.kyn === "Karlar");
