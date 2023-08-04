import { QueryTypes } from 'sequelize';
import ServiceResponse from '../Interfaces/IServiceResponse';
import CustomError from '../utils/CustomError';
import httpStatus from '../utils/httpStatus';
import { QueryAway, QueryHome } from './QuerysLeaderboard';
import sequelize from '../database/models';
import ILeaderboardResponse from '../Interfaces/leaderboard/ILeaderboardResponse';

export default class LeaderboardService {
  static async home(): Promise<ServiceResponse<ILeaderboardResponse[]>> {
    const leaderboard: ILeaderboardResponse[] = await sequelize
      .query(QueryHome, { type: QueryTypes.SELECT });

    if (!leaderboard) {
      throw new CustomError('Leaderboard not found', httpStatus.notFound);
    }
    return {
      type: httpStatus.ok,
      message: 'Success',
      data: { value: leaderboard },
    };
  }

  static async away(): Promise<ServiceResponse<ILeaderboardResponse[]>> {
    const leaderboard: ILeaderboardResponse[] = await sequelize
      .query(QueryAway, { type: QueryTypes.SELECT });
    if (!leaderboard) {
      throw new CustomError('Leaderboard not found', httpStatus.notFound);
    }
    return {
      type: httpStatus.ok,
      message: 'Success',
      data: { value: leaderboard },
    };
  }
}
