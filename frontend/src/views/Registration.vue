<template lang="pug">
	.page.login
		h1 Selecteer de vakken die je opneemt
		div.courses
			ul(v-if='semester1.length !== 0').sem Semester1
				li(v-for='(course) in semester1')
					input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
					label {{course.name}}
			ul(v-if='semester2.length !== 0').sem Semester2
				li(v-for='(course) in semester2')
					input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
					label {{course.name}}
			ul(v-if='semester3.length !== 0').sem Semester3
				li(v-for='(course) in semester3')
					input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
					label {{course.name}}
			ul(v-if='semester4.length !== 0').sem Semester4
				li(v-for='(course) in semester4')
					input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
					label {{course.name}}
			ul(v-if='semester5.length !== 0').sem Semester5
				li(v-for='(course) in semester5')
					input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)' )
					label {{course.name}}
			ul(v-if='semester6.length !== 0').sem Semester6
				li(v-for='(course) in semester6')
					input(type='checkbox' v-model='course.select' v-on:click='applyForCourse (course)')
					label {{course.name}}
			input(type='submit' value='Opslaan' v-on:click='save')

</template>

<script>
import axios from 'axios';

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
		fetchCourses () {
			let self = this;
			axios.get('http://localhost:3001/courses')
				.then((result) => {
					self.allCourses = result.data;
					self.processLayout(result.data);
				});
		},
		processLayout (d) {
			let self = this;
			d.forEach(function (course) {
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
				for (let i = 0; i < this.userCourses.length - 1; i++) {
					if (this.userCourses[i] === course._id) {
						this.userCourses.splice(i, 1);
					}
				}
			}
		},
		fetchUsercourses () {
			axios.get('http://localhost:3001/users/r000')
				.then((result) => {
					let user = result.data;
					this.userCourses = user.courses;
				});
		},
		toJson (e) {
			return '{ "courses": ' + JSON.stringify(e) + '}';
		},
		save () {
			axios.put('http://localhost:3001/users/r000', this.toJson(this.userCourses), { headers: { 'Content-Type': 'application/json' } })
				.then(res => console.log(res))
				.catch(e => console.log(e));
		}
	},
	mounted () {
		this.fetchUsercourses();
		this.fetchCourses();
	},
	beforeDestroy () {
		axios.put('http://localhost:3001/users/r000', this.toJson(this.userCourses), { headers: { 'Content-Type': 'application/json' } })
			.then(res => console.log(res))
			.catch(e => console.log(e));
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/css/definitions';
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

</style>
