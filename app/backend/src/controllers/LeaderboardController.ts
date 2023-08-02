import { NextFunction, Request, Response } from 'express';
import { responseWithData } from '../utils/handleResponse';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private leaderboardService: LeaderboardService;
  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  public async home(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const matchesResponse = await this.leaderboardService.home();
      return responseWithData(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }
}
