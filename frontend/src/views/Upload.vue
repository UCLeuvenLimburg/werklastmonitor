<template lang="pug">
	.page.upload
		h1 Excel-bestand uploaden
		p Selecteer een Office Excel, LibreOffice Calc, of een CSV-bestand.
		input(name="file", id="file", type="file", accept=".xls,.xlsx,.ods,.csv" @change="onFileChange")
		label(for="file")
			mdi-upload-icon
			p Kies een bestand...
</template>

<script>
import 'mdi-vue/UploadIcon';

import XLSX from 'xlsx';

export default {
	name: 'upload',
	data () {
		return {
			image: ''
		};
	},
	methods: {
		onFileChange (e) {
			let files = e.target.files || e.dataTransfer.files;
			if (!files.length) {
				return;
			}
			this.parseSheet(files[0]);
		},
		parseSheet (file) {
			let reader = new FileReader();
			let rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
			reader.onload = (e) => {
				let data = e.target.result;
				if (!rABS) {
					data = new Uint8Array(data);
				}
				let workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array', cellDates: true });
				let sheetNameList = workbook.SheetNames;

				let labWorkSheet = workbook.Sheets[sheetNameList[0]];
				let labsJSON = XLSX.utils.sheet_to_json(labWorkSheet, { header: 1 });

				let milestoneWorkSheet = workbook.Sheets[sheetNameList[1]];
				let milestoneJSON = XLSX.utils.sheet_to_json(milestoneWorkSheet, { header: 1 });

				let labs = [];

				for (let i = 1; i < labsJSON.length; ++i) {
					let labJSONTemplate = {
						name: '',
						startDate: '',
						endDate: '',
						hourEstimate: '',
						courseId: '',
						milestones: []
					};

					labJSONTemplate.name = labsJSON[i][0];
					labJSONTemplate.startDate = labsJSON[i][1];
					labJSONTemplate.endDate = labsJSON[i][2];
					labJSONTemplate.hourEstimate = labsJSON[i][3];
					labJSONTemplate.courseId = labsJSON[i][4];

					labs.push(labJSONTemplate);
				}

				for (let i = 1; i < milestoneJSON.length; ++i) {
					let milestoneJSONTemplate = {
						name: '',
						duration: '',
						isDone: false
					};

					milestoneJSONTemplate.name = milestoneJSON[i][0];
					milestoneJSONTemplate.duration = milestoneJSON[i][1];

					labs.forEach(lab => {
						if (lab.name === milestoneJSON[i][2]) {
							lab.milestones.push(milestoneJSONTemplate);
						}
					});
				}

				console.log('labs');
				console.log(labs);
				/*
				for (let i = 0; i < opdrachten.length; i++) {
					opdrachten[i].startdatum.setHours(opdrachten[i].startdatum.getHours() + 2);
					opdrachten[i].einddatum.setHours(opdrachten[i].einddatum.getHours() + 2);
				}
				*/
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
</style>
