<template lang="pug">
	.page.workload
		h1 Werklast
		p
			| Overzicht van werklast per&nbsp;
			select(@change='handleChange')
				option(value='month', selected='selected') Maand
				option(value='week') Week
				option(value='day') Dag
		graph-stackbar(
			:height="400",
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
	data () {
		return {
			// View per month is default
			names: [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ],
			values: [
				[ 10, 5, 5, 5, 10, 11 ],
				[ 8, 5, 6, 10, 2, 5 ],
				[ 10, 5, 7, 5, 10, 10 ],
				[ 8, 10, 7, 10, 10, 11 ]
			],
			labels: [ '01/19', '02/19', '03/19', '04/19', '05/19', '06/19' ]
		};
	},
	methods: {
		handleChange (e) {
			let selection = e.target.options[e.target.options.selectedIndex].valueOf().value;
			if (selection === 'day') {
				this.names = [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ];
				this.values = [
					[ 3, 5, 2, 5, 2, 3 ],
					[ 8, 5, 6, 10, 2, 1 ],
					[ 10, 5, 7, 5, 1, 2 ],
					[ 8, 10, 7, 4, 2, 2 ]
				];
				this.labels = [ 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag' ];
			} else if (selection === 'week') {
				this.names = [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ];
				this.values = [
					[ 5, 5, 2, 5 ],
					[ 8, 5, 6, 10 ],
					[ 8, 5, 7, 5 ],
					[ 8, 10, 7, 4 ]
				];
				this.labels = [ '01-07/02', '08-14/02', '15-23/02', '23-30/02' ];
			} else {
				this.names = [ 'Computersystemen', 'Web 1', 'Netwerken', 'BOP' ];
				this.values = [
					[ 10, 5, 5, 5, 10, 11 ],
					[ 8, 5, 6, 10, 2, 5 ],
					[ 10, 5, 7, 5, 10, 10 ],
					[ 8, 10, 7, 10, 10, 11 ]
				];
				this.labels = [ '01/19', '02/19', '03/19', '04/19', '05/19', '06/19' ];
			};
		}
	}
};
</script>
