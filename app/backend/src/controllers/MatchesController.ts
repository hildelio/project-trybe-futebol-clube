import { NextFunction, Request, Response } from 'express';
import { responseWithData } from '../utils/handleResponse';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private matchesService: MatchesService;
  constructor() {
    this.matchesService = new MatchesService();
  }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const matchesResponse = await this.matchesService.findAll();
      return responseWithData(res, matchesResponse);
    } catch (error) {
      next(error);
    }
  }
}
