import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url))

//Configurar pug
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));
app.enable('view_cache');
app.locals.pretty = true;
app.locals.tabs = true;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

const datos = {
	title: 'Descargar extension  para VSCode'
};

app.get('/', (req, res) => {
	res.render('index', { datos })
})

app.post('/getExtension', async (req, res) => {
	try {
		const { url, version } = req.body;

		const itemName = url.split('?')[1];

		if (itemName) {
			const pubExt = itemName.split('=')[1];
			console.log(itemName, pubExt)
			const dividePubExt = pubExt.split('.')
			const publisher = dividePubExt[0];
			const extension = dividePubExt[1];
			if (publisher && extension) {
				datos.url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;
				datos.timeToclick = true;
			} else {
				datos.timeToclick = false;
				datos.error = false;
				datos.url = '';
			}
		} else {
			datos.timeToclick = false;
			datos.url = '';
			datos.error = 'Url incorrecta';
		}

		res.render('index', { datos });
	} catch (err) {
		res.status(500).send(err.msg || err.code || 'Error al obtener la extension');
	}
})

app.listen(port, () => {
	console.clear();
	console.log(`Servidor corriendo en puerto ${port}`);
})
