import { FindOptions } from 'sequelize';
import SequelizeMatch from '../database/models/MatchModel';
import { IMatchesModel } from '../Interfaces/matches';
import IMatches from '../Interfaces/matches/IMatches';

export default class MatchesModel implements IMatchesModel {
  private model = SequelizeMatch;

  async findAll(options?: FindOptions): Promise<IMatches[]> {
    const matches = await this.model.findAll(options);
    return matches;
  }

  async findById(id: number): Promise<SequelizeMatch | null> {
    const match = await this.model.findByPk(id);
    return match;
  }
}
