import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboard = Router();

const leaderboardController = new LeaderboardController();

leaderboard.get('/home', (req, res, next) => leaderboardController.home(req, res, next));

export default leaderboard;
