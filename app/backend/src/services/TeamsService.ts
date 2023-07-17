import TeamsModel from '../models/TeamsModel';
import ServiceResponse from '../Interfaces/IServiceResponse';
import ITeams from '../Interfaces/teams/ITeams';
import httpStatus from '../utils/httpStatus';
import CustomError from '../utils/CustomError';

export default class TeamsService {
  private teamsModel: TeamsModel;

  constructor() {
    this.teamsModel = new TeamsModel();
  }

  async findAll(): Promise<ServiceResponse<ITeams[]>> {
    const teams = await this.teamsModel.findAll();
    if (!teams) {
      throw new CustomError('Teams not founded', httpStatus.notFound);
    }
    return { type: httpStatus.ok, message: 'Success', data: { value: teams } };
  }

  async findById(id: number): Promise<ServiceResponse<ITeams>> {
    const team = await this.teamsModel.findById(id);
    if (!team) {
      throw new CustomError('Team not founded', httpStatus.notFound);
    }
    return { type: httpStatus.ok, message: 'Success', data: { value: team } };
  }
}
