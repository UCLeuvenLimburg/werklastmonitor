<template lang="pug">
	.page.upload
		h1 Excel-bestand uploaden
		ul(v-if="errors.length !== 0").errorlist
			li(v-for="error in errors").error {{error.param}}: {{error.msg}}
		p(v-if="success && errors.length === 0").success Uw labo's zijn succesvol toegevoegd!
		p Selecteer een Office Excel (.xls, .xlsx) of LibreOffice Calc (.ODS)
		input(name="file", id="file", type="file", accept=".xls,.xlsx,.ods" @change="onFileChange")
		label(for="file")
			mdi-upload-icon
			p Kies een bestand...
		label(v-on:click="download")
			mdi-download-icon
			p Download sjabloon
		.instructions
			h2 Instructies
			ol
				li Download het lege sjabloon
				li
					| Vul de gewenste labs of opdrachten in op het
					strong  eerste blad
					|  (Lab)
				li
					| Vul de gewenste milestones in op het
					strong  tweede blad
					|  (Milestones)
					br
					strong Opgelet:
					|  de &quot;labnaam&quot; in het blad Milestones moet overeenkomen met een van de labnamen.
			h3 Voorbeeld
			.table
				table(v-if="!tab")
					tr
						th naam
						th beschrijving
						th startdatum
						th einddatum
						th aantal werkuren
						th vaknummer
					tr
						td 3D raytracer
						td Begin op tijd aan MESH!
						td 4-3-2019
						td 3-6-2019
						td 6
						td B-UCLL-MBI62A
					tr
						td VGO
						td Deze opdracht moeten jullie ook mondeling verdedigen op het examen.
						td 24-11-2019
						td 26-11-2019
						td 8
						td B-UCLL-MBI50X
					tr
						td &nbsp;
						td
						td
						td
						td
						td

				table(v-if="tab")
					tr
						th naam
						th werkuren
						th labnaam
					tr
						td extensie 1
						td 2
						td 3D raytracer
					tr
						td extensie 2
						td 4
						td 3D raytracer
					tr
						td feature
						td 8
						td VGO

				ul.table
					li.table(v-on:click="setTab(false)") Lab
					li.table(v-on:click="setTab(true)") Milestones

</template>

<script>
import 'mdi-vue/UploadIcon';
import 'mdi-vue/DownloadIcon';

import XLSX from 'xlsx';
import LabsService from '@/api/LabsService';
import fileservice from '../api/FileService.js';
import FileDownload from 'js-file-download';

export default {
	name: 'upload',
	data () {
		return {
			image: '',
			errors: [],
			tab: false,
			success: false
		};
	},
	methods: {
		download () {
			fileservice.get('template.xlsx')
				.then((response) => {
					FileDownload(response.data, 'Template.xlsx');
				});
		},
		setTab (b) {
			this.tab = b;
		},
		onFileChange (e) {
			let self = this;
			self.success = false;
			let files = e.target.files || e.dataTransfer.files;
			if (!files.length) {
				return;
			}
			this.parseSheet(files[0]);
			if (self.errors.length === 0) {
				// console.log(self.errors.length);
				self.success = true;
			}
		},
		formatDate (date) {
			let tempDate = new Date(date);
			let month = (tempDate.getMonth() + 1 < 10) ? '0' + (tempDate.getMonth() + 1) : (tempDate.getMonth() + 1);
			let day = (tempDate.getDate() < 10) ? '0' + tempDate.getDate() : tempDate.getDate();
			return (tempDate.getFullYear() + '-' + month + '-' + day);
		},
		parseSheet (file) {
			this.errors = [];
			let reader = new FileReader();
			let rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
			reader.onload = (e) => {
				let self = this;
				let data = e.target.result;
				if (!rABS) {
					data = new Uint8Array(data);
				}
				let workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array', cellDates: true });
				let sheetNameList = workbook.SheetNames;

				let labWorkSheet = workbook.Sheets[sheetNameList[0]];
				let labsJSON = XLSX.utils.sheet_to_json(labWorkSheet, { header: 1, dateNF: 'YYYY-MM-DD' });

				let milestoneWorkSheet = workbook.Sheets[sheetNameList[1]];
				let milestoneJSON = XLSX.utils.sheet_to_json(milestoneWorkSheet, { header: 1, dateNF: 'YYYY-MM-DD' });

				let labs = [];

				if (labsJSON[1].length) {
					for (let i = 1; i < labsJSON.length; ++i) {
						let labJSONTemplate = {
							name: '',
							description: '',
							startDate: '',
							endDate: '',
							hourEstimate: '',
							course: '',
							milestones: []
						};

						labJSONTemplate.name = labsJSON[i][0];
						labJSONTemplate.description = labsJSON[i][1];
						labJSONTemplate.startDate = labsJSON[i][2];
						labJSONTemplate.endDate = labsJSON[i][3];
						labJSONTemplate.hourEstimate = labsJSON[i][4];
						labJSONTemplate.course = labsJSON[i][5];

						labs.push(labJSONTemplate);
					}

					for (let i = 1; i < milestoneJSON.length; ++i) {
						let milestoneJSONTemplate = {
							name: '',
							duration: ''
						};

						milestoneJSONTemplate.name = milestoneJSON[i][0];
						milestoneJSONTemplate.duration = milestoneJSON[i][1];

						labs.forEach((lab) => {
							if (lab.name === milestoneJSON[i][2]) {
								lab.milestones.push(milestoneJSONTemplate);
							}
						});
					}

					let milestonesCount = 0;
					labs.forEach((lab) => {
						if (lab.startDate && lab.endDate) {
							lab.startDate.setHours(lab.startDate.getHours() + 1);
							lab.endDate.setHours(lab.endDate.getHours() + 1);
							lab.startDate = this.formatDate(lab.startDate);
							lab.endDate = this.formatDate(lab.endDate);
						}
						milestonesCount += lab.milestones.length;
					});

					if (milestonesCount !== milestoneJSON.length - 1) {
						self.errors.push({
							msg: 'Een milestone in het bestand heeft een onbestaande lab naam',
							param: 'bestand'
						});
					} else {
						labs.forEach(async (lab) => {
							await LabsService.post(lab)
								.catch((err) => {
									err.response.data.errors.forEach((err) => {
										self.errors.push(err);
									});
								});
						});
					}
				} else {
					self.errors.push({
						msg: 'mag niet leeg zijn',
						param: 'bestand'
					});
				}
			};
			if (rABS) {
				reader.readAsBinaryString(file);
			} else {
				reader.readAsArrayBuffer(file);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

input {
	width: .1px;
	height: .1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;

	&:focus + label {
		background: $color-fg;
	}
}

label {
	margin-top: 4px;
	margin: 5px;
	font-weight: bold;
	color: $color-content-bg;
	background: $color-accent;
	display: inline-flex;
	flex-direction: row;
	padding: 8px;
	cursor: pointer;
	transition: .2s ease;

	&:hover {
		background: $color-fg;
	}

	svg {
		fill: $color-content-bg;
		width: 1.5rem;
		height: 1.5rem;
	}

	p {
		padding: 0 8px;
		line-height: 1.5rem;
	}
}
.error {
	color: red;
	margin: 1%;
}

.errorlist {
	list-style: none;
	border-style: solid;
	border-width: 2px;
	border-color: red;
}

.success {
	color: green
}

table, th, td {
	border: 1px solid black;
}

div.table{
	display: flex;
	flex-direction: column;
}

ul.table{
	width: 80%;
	margin-left: 5%;
	padding-top: 5px;
	padding-bottom: 2px;
	background-color: $color-fg;

	&::after{
		margin-left: 1em;
		content: "Wissel tussen bladen";
		color: white;
	}
}

li.table {
	display: inline;
	border: solid;
	border-width: 1px 1px 0 1px;
	padding: 5px;
	color:white;
	background-color: $color-accent;
	cursor: pointer;

	&:hover{
		background: white;
		color: $color-fg;
	}
}

@media only screen and (max-width: 600px) {

	div.table {
		overflow-x: auto;
	}
	ul.table::after{
		content: "";
	}
}

.instructions {
	margin-top: 20px;
	img {
		width: 90%;
		margin: 10px;
		align-content: center;
	}
	ol {
		margin-left: 5%;
		margin-bottom: 1em;

		li {
			padding: 5px;
		}
	}

	table {
		border-collapse: collapse;
		width: 80%;
		margin-left: 5%;
		margin-top: 2%;
	}

	td, th {
		text-align: left;
		padding: 10px;
	}

	th {
		background-color: $color-accent;
		color: $color-content-bg;
	}

}
</style>
