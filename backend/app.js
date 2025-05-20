import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();
app.use(cors({
  origin:'https://kunikasirpor.github.io',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

export default app;
