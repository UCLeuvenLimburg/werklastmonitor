<template lang="pug">
	.page.login
		h1 Selecteer de vakken die je opneemt
		button#savebutton(@click="save")
			mdi-content-save-icon
			p Opslaan
		div.courses
			section.year#left(v-if="semester1.length && semester2.length")
				h2 Eerste jaar
				h3(v-if="semester1.length", @click="semester1Active = !semester1Active") Semester 1
				ul(v-if="semester1.length", :class="{ active: semester1Active }").sem
					li(v-for="course in semester1")
						input(type="checkbox" v-model="course.select" @click="applyForCourse(course)")
						label {{course.name}}
				h3(v-if="semester2.length", @click="semester2Active = !semester2Active") Semester 2
				ul(v-if="semester2.length", :class="{ active: semester2Active }").sem
					li(v-for="course in semester2")
						input(type="checkbox" v-model="course.select" @click="applyForCourse(course)")
						label {{course.name}}
			section.year#middle(v-if="semester3.length && semester4.length")
				h2 Tweede jaar
				h3(v-if="semester3.length", @click="semester3Active = !semester3Active") Semester 3
				ul(v-if="semester3.length", :class="{ active: semester3Active }").sem
					li(v-for="course in semester3")
						input(type="checkbox" v-model="course.select" @click="applyForCourse(course)")
						label {{course.name}}
				h3(v-if="semester4.length", @click="semester4Active = !semester4Active") Semester 4
				ul(v-if="semester4.length", :class="{ active: semester4Active }").sem
					li(v-for="course in semester4")
						input(type="checkbox" v-model="course.select" @click="applyForCourse(course)")
						label {{course.name}}
			section.year#right(v-if="semester5.length && semester6.length")
				h2 Derde jaar
				h3(v-if="semester5.length", @click="semester5Active = !semester5Active") Semester 5
				ul(v-if="semester5.length", :class="{ active: semester5Active }").sem
					li(v-for="course in semester5")
						input(type="checkbox" v-model="course.select" @click="applyForCourse(course)" )
						label {{course.name}}
				h3(v-if="semester6.length", @click="semester6Active = !semester6Active") Semester 6
				ul(v-if="semester6.length", :class="{ active: semester6Active }").sem
					li(v-for="course in semester6")
						input(type="checkbox" v-model="course.select" @click="applyForCourse(course)")
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
			allCourses: [],
			semester1Active: false,
			semester2Active: false,
			semester3Active: false,
			semester4Active: false,
			semester5Active: false,
			semester6Active: false
		};
	},
	methods: {
		async fetchCourses () {
			let result = await courseService.get();
			this.allCourses = result.data;
		},
		processLayout (courses) {
			let self = this;

			courses.forEach((course) => {
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
		});
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

h2 {
	padding-bottom: 3%;
}

h3 {
	cursor: pointer;
}

.page.login {
	position: relative;
}

.sem {
	color: $color-fg;
	font-size: large;
	font-weight: bold;
	margin: 10px;
	list-style: none;
	max-height: 0;
	transition: 1s ease;
	overflow: hidden;

	&.active {
		max-height: 510px;
	}

	li {
		text-decoration: none;
		font-weight: normal;
		font-size: medium;
		margin-left: 1%;
		padding: 5px;
	}
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

@media only screen and (min-width: 600px) {
	#savebutton {
		position: absolute;
		right: 0;
		top: 0;
	}
	h1 {
		display: inline;
	}
}

#savebutton {
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
