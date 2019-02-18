module.exports = {
	port: 3001,
	secret: 'vkHv733TqWVxv7p5LL7XCYdptcY8j6ec',
	ldap: {
		host: 'ad.ucll.be',
		port: 389,
		userId: '{{username}}@ucll.be'
	},
	database: {
		poolSize: 100
	}
};
