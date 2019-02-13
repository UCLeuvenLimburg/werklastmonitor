<template>
		<div>
			<h1>Excel-bestand uploaden</h1>
			<p>Selecteer een Office Excel, LibreOffice Calc, of een CSV-bestand.</p>
			<div>
			<input type="file" accept=".xls,.xlsx,.ods,.csv" @change="onFileChange">
			</div>
		</div>
</template>

<script>
import XLSX from 'xlsx';
export default {
	name: 'upload',
	data: function () {
		return {
			image: '' };
	},

	methods: {
		onFileChange: function onFileChange (e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length) { return; }
			this.parseSheet(files[0]);
		},
		parseSheet: function parseSheet (file) {
			var reader = new FileReader();
			var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
			reader.onload = function (e) {
				var data = e.target.result;
				if (!rABS) data = new Uint8Array(data);
				const workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array', cellDates: true });
				const sheetnamelist = workbook.SheetNames;
				var opdrachten = XLSX.utils.sheet_to_json(workbook.Sheets[sheetnamelist[0]]);
				for (var i = 0; i < opdrachten.length; i++) {
					opdrachten[i].Begindatum.setHours(opdrachten[i].Begindatum.getHours() + 2);
					opdrachten[i].Einddatum.setHours(opdrachten[i].Einddatum.getHours() + 2);
				}
				console.log(opdrachten);
				console.log('De eerste opdrachtnaam is ' + opdrachten[1].Opdracht);
			};
			if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
		} } };
</script>
