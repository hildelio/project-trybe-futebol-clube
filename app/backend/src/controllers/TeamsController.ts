import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';
import { response, responseWithData } from '../utils/handleResponse';

export default class TeamsController {
  private teamsService: TeamsService;
  constructor() {
    this.teamsService = new TeamsService();
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const { type, message, data: { value } } = await this.teamsService.findAll();
      return responseWithData(res, { type, message, data: { value } });
    } catch (error) { // estudar como tratar erros
      return response(res, { type: 500, message: 'Internal Server Error', data: { value: null } });
    }
  }
}
