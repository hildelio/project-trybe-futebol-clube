import TeamsModel from '../models/TeamsModel';
import ServiceResponse from '../Interfaces/IServiceResponse';
import ITeams from '../Interfaces/teams/ITeams';
import httpStatus from '../utils/httpStatus';

export default class TeamsService {
  private teamsModel: TeamsModel;

  constructor() {
    this.teamsModel = new TeamsModel();
  }

  async findAll(): Promise<ServiceResponse<ITeams[]>> {
    try {
      const teams = await this.teamsModel.findAll();
      return { type: httpStatus.ok, message: 'Success', data: { value: teams } };
    } catch (error) { // estudar como tratar erros
      return {
        type: httpStatus.internalServerError,
        message: 'Internal Server Error',
        data: { value: null },
      };
    }
  }
}
