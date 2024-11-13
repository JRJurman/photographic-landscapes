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

const homePageEntry = '1g3BTLM0CkE2P4wAidOlDD';
const showsPageEntry = '12iAUWL842bJzzgtauHhd3';
const photosPageEntry = '6GPzfSeoHP2oXNz7NAC6dF';
const contactPageEntry = '5243Thx57mMBoG4ZlS98pA';

const buildCalendarConfigs = (event) => {
	// build a calendar config for each month
	// we do this because each calendar display only supports a single month
	const startDate = new Date(event.fields.startDate);
	const endDate = new Date(event.fields.endDate);
	const months = endDate.getMonth() - startDate.getMonth() + 1;
	const calendars = Array(months)
		.fill(0)
		.map((e, monthOffset) => {
			const newDate = new Date(startDate);
			newDate.setMonth(startDate.getMonth() + monthOffset);

			const lastDateOfMonth = new Date(startDate);
			lastDateOfMonth.setMonth(startDate.getMonth() + monthOffset + 1);
			lastDateOfMonth.setUTCDate(0);

			const start = monthOffset === 0 ? startDate.getUTCDate() : 1;
			const end = monthOffset === months - 1 ? endDate.getUTCDate() : lastDateOfMonth.getUTCDate();

			const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(newDate);
			return {
				month: monthName,
				year: newDate.getFullYear(),
				start: start,
				end: end,
			};
		});

	return calendars;
};

const processEventData = (event) => {
	return {
		title: event.fields.title,
		photo: {
			file: event.fields.photo.fields.file.url,
			description: event.fields.photo.fields.description,
		},
		calendars: buildCalendarConfigs(event),
		startDate: event.fields.startDate,
		endDate: event.fields.endDate,
		description: documentToHtmlString(event.fields.description),
	};
};

const test = async () => {
	const showsPage = await client.getEntry(showsPageEntry);
	const { events } = showsPage.fields;
	console.log(processEventData(events.at(0)).description);

	const homePage = await client.getEntry(homePageEntry);
	const { blurb } = homePage.fields;
	console.log(documentToHtmlString(blurb));
};

// test();

app.get('/', async (req, res) => {
	req.params.page = 'home';
	const homePage = await client.getEntry(homePageEntry);
	const { graphic, blurb } = homePage.fields;

	res.render('home', { graphic: graphic.fields, blurb: documentToHtmlString(blurb) });
});

app.get('/shows', async (req, res) => {
	const showsPage = await client.getEntry(showsPageEntry);
	const { events } = showsPage.fields;

	// TODO filter and sort
	const eventsData = events.map(processEventData);
	res.render('shows', { events: eventsData });
});

app.get('/photos', async (req, res) => {
	const photosPage = await client.getEntry(photosPageEntry);
	const { thumbnails } = photosPage.fields;

	res.render('photos', { thumbnails });
});

app.get('/contact', async (req, res) => {
	const contactPage = await client.getEntry(contactPageEntry);
	const { graphic, blurb } = contactPage.fields;

	res.render('contact', { graphic: graphic.fields, blurb: documentToHtmlString(blurb) });
});

app.get('*', async (req, res) => {
	res.render('404', {});
});

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});
