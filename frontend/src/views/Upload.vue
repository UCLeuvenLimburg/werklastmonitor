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
				const workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array', cellDates: true });
				const sheetnamelist = workbook.SheetNames;
				let opdrachten = XLSX.utils.sheet_to_json(workbook.Sheets[sheetnamelist[0]]);
				for (let i = 0; i < opdrachten.length; i++) {
					opdrachten[i].Begindatum.setHours(opdrachten[i].Begindatum.getHours() + 2);
					opdrachten[i].Einddatum.setHours(opdrachten[i].Einddatum.getHours() + 2);
				}
				console.log(opdrachten);
				console.log('De eerste opdrachtnaam is ' + opdrachten[1].Opdracht);
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
