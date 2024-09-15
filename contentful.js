const contentful = require('contentful');
const client = contentful.createClient({
	space: 'oe7hffw7j2kq',
	accessToken: 'fNozZJHFS4tRC6UcqHcZw162PnQ7ClyhNpdyZrGhm08',
});

module.exports = client;
