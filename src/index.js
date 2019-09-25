/* eslint-disable no-console */
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import './middleware/passport';
import v1 from './api/v1';

const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use('/api', v1);

export default app;
