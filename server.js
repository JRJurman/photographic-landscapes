const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

app.engine('hbs', engine({ defaultLayout: false }));
app.set('view engine', '.hbs');
app.set('views', './pages');

app.get('/', (req, res) => {
	res.render('home', { name: 'Tina' });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
