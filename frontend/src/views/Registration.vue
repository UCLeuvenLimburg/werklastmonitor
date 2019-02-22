<template lang="pug">
	.page.login
		h1 Selecteer de vakken die je opneemt
		button#savebutton(@click="save")
			mdi-content-save-icon
			p Opslaan
		div.courses
			section.year#left(v-if='semester1.length !== 0 && semester2.length !== 0')
				h2 Eerste jaar
				ul(v-if='semester1.length !== 0').sem Semester1
					li(v-for='(course) in semester1')
						input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
						label {{course.name}}
				ul(v-if='semester2.length !== 0').sem Semester2
					li(v-for='(course) in semester2')
						input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
						label {{course.name}}
			section.year#middle(v-if='semester3.length !== 0 && semester4.length !== 0')
				h2 Tweede jaar
				ul(v-if='semester3.length !== 0').sem Semester3
					li(v-for='(course) in semester3')
						input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
						label {{course.name}}
				ul(v-if='semester4.length !== 0').sem Semester4
					li(v-for='(course) in semester4')
						input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
						label {{course.name}}
			section.year#right(v-if='semester5.length !== 0 && semester6.length !== 0')
				h2 Derde jaar
				ul(v-if='semester5.length !== 0').sem Semester5
					li(v-for='(course) in semester5')
						input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)' )
						label {{course.name}}
				ul(v-if='semester6.length !== 0').sem Semester6
					li(v-for='(course) in semester6')
						input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
						label {{course.name}}

</template>

<script>
import 'mdi-vue/ContentSaveIcon';

import userService from '../api/UsersService.js';
import courseService from '../api/CoursesService.js';

export default {
	name: 'Registration',
	data () {
		return {
			semester1: [],
			semester2: [],
			semester3: [],
			semester4: [],
			semester5: [],
			semester6: [],
			userCourses: [],
			allCourses: []
		};
	},
	methods: {
		async fetchCourses () {
			let result = await courseService.get();
			this.allCourses = result.data;
		},
		processLayout (courses) {
			let self = this;

			courses.forEach(function (course) {
				if (self.userCourses.includes(course._id)) {
					course.select = true;
				} else {
					course.select = false;
				}
				self.selectList(course.semester, course);
			});
		},
		selectList (semester, course) {
			let self = this;
			switch (semester) {
			case 1:
				self.semester1.push(course);
				break;
			case 2:
				self.semester2.push(course);
				break;
			case 3:
				self.semester3.push(course);
				break;
			case 4:
				self.semester4.push(course);
				break;
			case 5:
				self.semester5.push(course);
				break;
			case 6:
				self.semester6.push(course);
				break;
			default:
				console.error('something bad happened');
			}
		},
		applyForCourse (course) {
			if (course.select === false) {
				this.userCourses.push(course._id);
			} else {
				for (let i = 0; i < this.userCourses.length; i++) {
					if (this.userCourses[i] === course._id) {
						this.userCourses.splice(i, 1);
						break;
					}
				}
			}
		},
		async fetchUsercourses () {
			let result = await userService.get(this.username);
			this.userCourses = result.data.courses;
		},
		save () {
			userService.put(this.username, {
				courses: this.userCourses
			});
		}
	},
	async created () {
		await this.fetchUsercourses();
		await this.fetchCourses();
		this.processLayout(this.allCourses);
	},
	beforeDestroy () {
		userService.put(this.username, {
			courses: this.userCourses
		}).then(res => console.log(res))
			.catch(e => console.log(e));
	},
	watch: {
		$route (to, from) {
			console.log(to);
			console.log(from);
		}
	},
	computed: {
		username () {
			return this.$store.state.username;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';

.page.login {
	position: relative;
}

.sem{
		color: $color-fg;
		font-size: large;
		font-weight: bold;
		margin: 10px;
		list-style: none;

		li{
			text-decoration: none;
			font-weight: normal;
			font-size: medium;
			margin-left: 1%;
			padding: 5px;
		}
}

h1 {
	display: inline;
}

.courses {
	margin-top: 10px;
	display: grid;
	grid-template-columns: 33% 33% 33%;
}

#left {
	grid-column: 1;
	// height: 100%;
}

#middle {
	display: -ms-inline-grid;
	grid-column: 2;
	// height: 100%;
}

#right {
	display: -ms-inline-grid;
	grid-column: 3;
	// height: 100%;
}

#savebutton {
	position: absolute;
	top: 0;
	right: 0;
	color: $color-content-bg;
	background: $color-accent;
	display: inline-flex;
	flex-direction: row;
	padding: 8px;
	cursor: pointer;
	transition: .2s ease;
	border: 0;

	&:hover{
		background: $color-fg;
	}

	svg {
		fill: $color-content-bg;
		width: 1.5rem;
		height: 1.5rem;
	}

	p {
		padding: 0 8px;
		font: 1rem $font;
		line-height: 1.5rem;
		font-weight: bold;
	}
}

</style>
