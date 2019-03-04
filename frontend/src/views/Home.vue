<template lang="pug">
	.page.home
		h1 Home
		h2(v-if="name") Welkom {{name}}
		p De Werklastmonitor is een tool om studenten van de UC Leuven-Limburg te helpen met het inschatten van hun werklast en studiesessies in te plannen.
		p Wanneer je een gedurende een bepaalde periode wilt werken of hebt gewerkt aan een vak, kun je deze werksessie toevoegen via de pagina ‘Toevoegen’. Je werksessies worden vervolgens op de agenda gevisualiseerd.
		p Je docenten hebben ook je deadlines en milestones toegevoegd. Deze krijg je eveneens in je agenda te zien.
		p Op het vakoverzicht krijg je een overzicht van alle opdrachten en milestones. Je ziet ook meteen visueel de verhouding tussen wat je effectief gepresteerd hebt en wat de lector verwacht dat je qua uren presteert. Deze gegevens kun je ook op de pagina Werklast visualiseren in een grafiek.
</template>

<script>
export default {
	name: 'home',
	computed: {
		name () {
			return this.$store.state.name;
		}
	}
};
</script>
