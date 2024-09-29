const express = require('express');
const { create } = require('express-handlebars');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

const client = require('./contentful');

const app = express();
const port = 3000;

// Create `ExpressHandlebars` instance with a default layout and shared partials
const hbs = create({
	defaultLayout: false,
	partialsDir: ['partials/'],
	extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './pages');

const test = async () => {
	const homePageEntry = '1g3BTLM0CkE2P4wAidOlDD';
	const homePage = await client.getEntry(homePageEntry);
	const { blurb } = homePage.fields;
	console.log(blurb);
	console.log();
};

// test();

app.get('/:page', async (req, res) => {
	const homePageEntry = '1g3BTLM0CkE2P4wAidOlDD';
	const homePage = await client.getEntry(homePageEntry);
	const { graphic, blurb } = homePage.fields;

	res.render(req.params.page, { graphic: graphic.fields, blurb: documentToHtmlString(blurb) });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
