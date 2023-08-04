import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboard = Router();

leaderboard.get('/home', (req, res, next) => LeaderboardController.home(req, res, next));

leaderboard.get('/away', (req, res, next) => LeaderboardController.away(req, res, next));

export default leaderboard;
