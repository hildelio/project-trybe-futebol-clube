import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/TeamsService';
import { responseWithData } from '../utils/handleResponse';

export default class TeamsController {
  private teamsService: TeamsService;
  constructor() {
    this.teamsService = new TeamsService();
  }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const teamsResponse = await this.teamsService.findAll();
      return responseWithData(res, teamsResponse);
    } catch (error) {
      next(error);
    }
  }

  public async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const teamResponse = await this.teamsService.findById(+id);
      return responseWithData(res, teamResponse);
    } catch (error) {
      next(error);
    }
  }
}
