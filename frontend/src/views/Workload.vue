<template lang="pug">
	.page.workload
		h1 Werklast
		p Overzicht van werklast per maand.
		graph-stackbar(
			height="400",
			:labels="labels",
			:full-mode="false",
			:show-text="true",
			:names="names",
			:values="values")
			legends(:names="names", :filter="true")
			tooltip(:names="names", position="right")
</template>

<script>
export default {
	name: 'workload',
	data: function () {
		return {
			names: [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ],
			values: [
				[ 10, 5, 5, 5, 10, 11 ],
				[ 8, 5, 6, 10, 2, 5 ],
				[ 10, 5, 7, 5, 10, 10 ],
				[ 8, 10, 7, 10, 10, 11 ]
			],
			labels: [ '01/19', '02/19', '03/19', '04/19', '05/19', '06/19' ]
		};
	}
};
</script>
