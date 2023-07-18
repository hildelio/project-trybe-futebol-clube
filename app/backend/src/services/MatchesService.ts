import IMatches from '../Interfaces/matches/IMatches';
import ServiceResponse from '../Interfaces/IServiceResponse';
import CustomError from '../utils/CustomError';
import httpStatus from '../utils/httpStatus';
import MatchesModel from '../models/MatchesModel';
import SequelizeTeam from '../database/models/TeamModel';

export default class MatchesService {
  private matchesModel: MatchesModel;

  constructor() {
    this.matchesModel = new MatchesModel();
  }

  async findAll(inProgress?: boolean): Promise<ServiceResponse<IMatches[]>> {
    try {
      let matches = await this.matchesModel.findAll({
        include: [
          { model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
        attributes: { exclude: [] } });

      if (typeof inProgress === 'boolean') {
        matches = matches.filter((match) => match.inProgress === inProgress);
      }

      return {
        type: httpStatus.ok,
        message: 'Success',
        data: { value: matches },
      };
    } catch (error) {
      throw new CustomError('Error retrieving matches', httpStatus.internalServerError);
    }
  }
}
