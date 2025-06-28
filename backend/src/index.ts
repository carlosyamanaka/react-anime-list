
import express from 'express';
import animeRoutes from './routes/animeRoutes';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', animeRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
