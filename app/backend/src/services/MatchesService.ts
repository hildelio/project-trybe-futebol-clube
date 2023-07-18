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

  async finish(id: number): Promise<ServiceResponse<IMatches>> {
    try {
      const matchToUpdate = await this.matchesModel.findById(id);

      if (!matchToUpdate) {
        throw new CustomError('Match not found', httpStatus.notFound);
      }

      matchToUpdate.inProgress = false;
      await matchToUpdate.save();
      return {
        type: httpStatus.ok,
        message: 'Finished',
        data: { value: matchToUpdate },
      };
    } catch (error) {
      throw new CustomError('Error finishing match', httpStatus.internalServerError);
    }
  }
}
