const express = require('express');
const { engine } = require('express-handlebars');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');

const client = require('./contentful');

const app = express();
const port = 3000;

app.engine('hbs', engine({ defaultLayout: false }));
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

app.get('/', async (req, res) => {
	const homePageEntry = '1g3BTLM0CkE2P4wAidOlDD';
	const homePage = await client.getEntry(homePageEntry);
	const { graphic, blurb } = homePage.fields;

	res.render('home', { graphic: graphic.fields, blurb: documentToHtmlString(blurb) });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
