<template lang="pug">
	.page.courses
		h1 Vakken
		div(v-for="(course, index) in courses" :key="course")
			h2 {{ course }}
			div(v-for="(lab, index) in assignments(course)" :key="lab.name")
				h3 {{ lab.name }}
				ul
					li(v-for="(milestone, index) in lab.milestones" :key="milestone.name")
						p.unchecked(v-on:click="check(milestone)", v-if="!milestone.isDone") {{ milestone.name }}
						p.checked(v-on:click="uncheck(milestone)", v-if="milestone.isDone") {{ milestone.name }}

</template>

<script>
export default {
	name: 'courses',
	data () {
		return {
			labs: [{
				name: 'Schrijfopdracht',
				startDate: new Date(),
				endDate: new Date(),
				hourEstimate: 50,
				course: { name: 'Computersystemen', fase: 1, courseCode: 'ABBA' },
				milestones: [{ name: 'Eerste pagina', duration: 30, isDone: true }, { name: 'Tweede pagina', duration: 30, isDone: false }]
			}, { name: 'Leesopdracht',
				startDate: new Date(),
				endDate: new Date(),
				hourEstimate: 50,
				course: { name: 'Computersystemen', fase: 1, courseCode: 'ABBA' },
				milestones: [{ name: 'Gelezen', duration: 30, isDone: false }]
			}, { name: 'Rudymoppen verzinnen',
				startDate: new Date(),
				endDate: new Date(),
				hourEstimate: 50,
				course: { name: 'Netwerken', fase: 1, courseCode: 'RUDY' },
				milestones: [{ name: 'Flauwe mop googlen', duration: 30, isDone: false }]
			}]
		};
	},
	computed: {
		courses: function () {
			let courseList = [];
			this.labs.forEach(lab => {
				courseList.push(lab.course.name);
			});
			return Array.from(new Set(courseList));
		}
	},
	methods: {
		assignments (course) {
			let assignmentList = [];
			this.labs.forEach(lab => {
				if (lab.course.name === course) {
					assignmentList.push(lab);
				}
			});
			return assignmentList;
		},
		check (m) {
			m.isDone = true;
		},
		uncheck (m) {
			m.isDone = false;
		}
	}
};
</script>
<style lang="scss" scoped>
	.checked {
		text-decoration: line-through;
	}
	li {
		margin-left: 1rem;
		cursor: pointer;
	}
</style>
