import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url))

//Configurar pug
app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));
app.enable('view_cache');

app.use(express.static(join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));

const datos = {};

app.get('/', (req, res) => {
	datos.title = 'Descargar extension  para VSCode';
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
			const vsExtUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;
			const respuesta = await axios.get(vsExtUrl);
			res.send()
		} else {
			res.send('Url incorrecta');
		}

		res.render('index', { message: 'Hola todo perfecto' });
	} catch (error) {
		console.log(err)
		res.status(500).send(err.msg || err.code || 'Error al obtener la extension');
	}
})

app.listen(port, () => {
	console.clear();
	console.log(`Servidor corriendo en puerto ${port}`);
})
