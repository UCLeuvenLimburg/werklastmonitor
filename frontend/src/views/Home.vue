<template lang="pug">
	.page.home
		h1 Home
		.userinfo(v-if="name")
			h2 Welkom {{name}}
			.deadlines
				h3 Deadlines binnen de 7 dagen
				ul
					li(v-for="deadline in deadlines" :class="{ red: deadline.red }") {{deadline.name}} : {{deadline.endDate}}, je hebt {{deadline.worked}} uren gewerkt van de {{deadline.hourEstimate}} uren voorzien volgens de lector.
		h3 Functie van deze applicatie
		p De Werklastmonitor is een tool om studenten van de UC Leuven-Limburg te helpen met het inschatten van hun werklast en studiesessies in te plannen.
		p Wanneer je een gedurende een bepaalde periode wilt werken of hebt gewerkt aan een vak, kun je deze werksessie toevoegen via de pagina ‘Toevoegen’. Je werksessies worden vervolgens op de agenda gevisualiseerd.
		p Je docenten hebben ook je deadlines en milestones toegevoegd. Deze krijg je eveneens in je agenda te zien.
		p Op het vakoverzicht krijg je een overzicht van alle opdrachten en milestones. Je ziet ook meteen visueel de verhouding tussen wat je effectief gepresteerd hebt en wat de lector verwacht dat je qua uren presteert. Deze gegevens kun je ook op de pagina Werklast visualiseren in een grafiek.
</template>

<script>
import userService from '@/api/UsersService';
import labService from '@/api/LabsService';
import worksessionService from '@/api/WorksessionService';
import moment from 'moment';

export default {
	name: 'home',
	data () {
		return {
			deadlines: [],
			labs: [],
			worksessions: [],
			userCourses: [],
			user: {}
		};
	},
	methods: {
		fillDeadlines () {
			this.labs.forEach((lab) => {
				if (moment(lab.endDate).diff(moment(), 'days') < 7 && moment(lab.endDate).diff(moment(), 'days') > 0) {
					let deadline = {};
					deadline.name = lab.name;
					deadline.endDate = moment(lab.endDate).format('ddd DD MMM YYYY');
					deadline.hourEstimate = lab.hourEstimate;
					let totalhours = 0;
					this.worksessions.forEach((worksession) => {
						if (worksession.lab === lab._id) {
							worksession.workdays.forEach((workday) => {
								totalhours += workday.workhours;
							});
						}
					});
					deadline.worked = totalhours;
					deadline.red = totalhours < deadline.hourEstimate;
					this.deadlines.push(deadline);
				}
			});
		}
	},
	computed: {
		name () {
			return this.$store.state.name;
		},
		username () {
			return this.$store.state.username;
		}
	},
	watch: {
		username () {
			if (this.$store.state.username !== null) {
				let self = this;
				(async () => {
					let req = await userService.get(self.username);
					self.user = req.data;
					self.userCourses = self.user.courses;
					let labs = await labService.get();
					labs.data.forEach((lab) => {
						if (self.userCourses.includes(lab.course._id)) {
							self.labs.push(lab);
						}
					});
					let worksessions = await worksessionService.get();
					worksessions.data.forEach((worksession) => {
						if (worksession.studentNumber === self.username) {
							self.worksessions.push(worksession);
						}
					});
					self.fillDeadlines();
				})();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.deadlines {
	margin-top: 1%;
	margin-bottom: 2%;
	ul {
		list-style-type: disc;
		margin: 2px;
		margin-left: 5%;
		li {
			text-decoration: none;
		}
		.red {
				color: red;
			}
	}
}
</style>
