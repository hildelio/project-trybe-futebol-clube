import { NextFunction, Request, Response } from 'express';
import { responseWithData } from '../utils/handleResponse';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  public static async home(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const matchesResponse = await LeaderboardService.home();
      return responseWithData(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }

  public static async away(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const matchesResponse = await LeaderboardService.away();
      return responseWithData(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }
}
