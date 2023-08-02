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
    let matches = await this.matchesModel.findAll({
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
      attributes: { exclude: [] } });
    if (!matches) {
      throw new CustomError('Matches not found', httpStatus.notFound);
    }

    if (typeof inProgress === 'boolean') {
      matches = matches.filter((match) => match.inProgress === inProgress);
    }

    return {
      type: httpStatus.ok,
      message: 'Success',
      data: { value: matches },
    };
  }

  async finish(id: number): Promise<ServiceResponse<IMatches>> {
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
  }

  async updateScore(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<IMatches>> {
    const matchToUpdate = await this.matchesModel.findById(id);
    if (!matchToUpdate) {
      throw new CustomError('Match not found', httpStatus.notFound);
    }
    matchToUpdate.homeTeamGoals = homeTeamGoals;
    matchToUpdate.awayTeamGoals = awayTeamGoals;
    await matchToUpdate.save();
    return {
      type: httpStatus.ok, message: 'Updated score', data: { value: matchToUpdate },
    };
  }

  async create({ homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }: IMatches):
  Promise<ServiceResponse<IMatches>> {
    const data = {
      homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress: true,
    };
    const newMatch = await this.matchesModel.create(data);
    return { type: httpStatus.created, message: 'Created', data: { value: newMatch } };
  }
}
