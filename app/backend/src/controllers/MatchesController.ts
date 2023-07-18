import { NextFunction, Request, Response } from 'express';
import { responseWithData, responseWithMessage } from '../utils/handleResponse';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private matchesService: MatchesService;
  constructor() {
    this.matchesService = new MatchesService();
  }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      let inProgress;

      switch (req.query.inProgress) {
        case 'true':
          inProgress = true;
          break;
        case 'false':
          inProgress = false;
          break;
        default:
          inProgress = undefined;
          break;
      }
      const matchesResponse = await this.matchesService.findAll(inProgress);
      return responseWithData(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }

  public async finish(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const matchesResponse = await this.matchesService.finish(+id);
      return responseWithMessage(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }

  public async updateScore(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const matchesResponse = await this.matchesService
        .updateScore(+id, homeTeamGoals, awayTeamGoals);
      return responseWithData(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }
}
