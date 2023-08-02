import { CreateOptions, FindOptions } from 'sequelize';
import SequelizeMatch from '../database/models/MatchModel';
import { IMatchesModel } from '../Interfaces/matches';
import IMatches from '../Interfaces/matches/IMatches';
import CustomError from '../utils/CustomError';
import httpStatus from '../utils/httpStatus';

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

  async create(data: Partial<Omit<IMatches, 'id'>>, options?: CreateOptions): Promise<IMatches> {
    try {
      const createdMatch = await this.model.create(data as Omit<IMatches, 'id'>, options);
      return createdMatch as IMatches;
    } catch (error) {
      throw new CustomError('Error creating match model', httpStatus.internalServerError);
    }
  }

  async count(): Promise<number> {
    const count = await this.model.count();
    return count;
  }

  getModel(): typeof SequelizeMatch {
    return this.model;
  }
}
