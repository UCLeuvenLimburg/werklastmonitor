<template lang="pug">
	.page.upload
		h1 Excel-bestand uploaden
		ul(v-if="errors.length !== 0").errorlist
			li(v-for="error in errors").error {{error.param}}: {{error.msg}}
		p Selecteer een Office Excel, LibreOffice Calc, of een CSV-bestand.
		input(name="file", id="file", type="file", accept=".xls,.xlsx,.ods,.csv" @change="onFileChange")
		label(for="file")
			mdi-upload-icon
			p Kies een bestand...
		label(for="template" v-on:click="download")
			mdi-download-icon
			p Download template
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
			errors: []
		};
	},
	methods: {
		download () {
			fileservice.get('template.xlsx')
				.then((response) => {
					FileDownload(response.data, 'Template.xlsx');
				});
		},
		onFileChange (e) {
			let files = e.target.files || e.dataTransfer.files;
			if (!files.length) {
				return;
			}
			this.parseSheet(files[0]);
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

				if(labsJSON[1].length) {
						for (let i = 1; i < labsJSON.length; ++i) {
							let labJSONTemplate = {
								name: '',
								startDate: '',
								endDate: '',
								hourEstimate: '',
								course: '',
								milestones: []
							};

							labJSONTemplate.name = labsJSON[i][0];
							labJSONTemplate.startDate = labsJSON[i][1];
							labJSONTemplate.endDate = labsJSON[i][2];
							labJSONTemplate.hourEstimate = labsJSON[i][3];
							labJSONTemplate.course = labsJSON[i][4];

							labs.push(labJSONTemplate);
						}

						for (let i = 1; i < milestoneJSON.length; ++i) {
							let milestoneJSONTemplate = {
								name: '',
								duration: ''
							};

							milestoneJSONTemplate.name = milestoneJSON[i][0];
							milestoneJSONTemplate.duration = milestoneJSON[i][1];

							labs.forEach(lab => {
								if (lab.name === milestoneJSON[i][2]) {
									lab.milestones.push(milestoneJSONTemplate);
								}
							});
						}

						labs.forEach(lab => {
							if (lab.startDate && lab.endDate) {
								lab.startDate.setHours(lab.startDate.getHours() + 1);
								lab.endDate.setHours(lab.endDate.getHours() + 1);
								lab.startDate = this.formatDate(lab.startDate);
								lab.endDate = this.formatDate(lab.endDate);
						}
					});

					labs.forEach(lab => {
						if (lab.startDate && lab.endDate) {
							lab.startDate.setHours(lab.startDate.getHours() + 1);
							lab.endDate.setHours(lab.endDate.getHours() + 1);
							lab.startDate = this.formatDate(lab.startDate);
							lab.endDate = this.formatDate(lab.endDate);
						}
					});

					console.log(labs);

					labs.forEach(async (lab) => {
						await LabsService.post(lab)
							.catch((err) => {
								console.log('error:' + err.response.data.errors);
								err.response.data.errors.forEach(function (error) {
									self.errors.push(error);
								});
							});
					});
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
</style>
