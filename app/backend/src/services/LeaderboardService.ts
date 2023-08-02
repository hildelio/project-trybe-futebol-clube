import * as sequelize from 'sequelize';
import SequelizeMatch from '../database/models/MatchModel';
import ILeaderboard from '../Interfaces/leaderboard/ILeaderboard';
import ServiceResponse from '../Interfaces/IServiceResponse';
import CustomError from '../utils/CustomError';
import httpStatus from '../utils/httpStatus';
import TeamsModel from '../models/TeamsModel';
import ITeams from '../Interfaces/teams/ITeams';
import MatchesModel from '../models/MatchesModel';
import TotalGoalsEntry from '../Interfaces/leaderboard/TotalGoalsEntry';
import SequelizeMatchExtended from '../Interfaces/leaderboard/SequelizeMatchExtended';
import IMatches from '../Interfaces/matches/IMatches';

export default class LeaderboardService {
  private teamsModel: TeamsModel;
  private matchesModel: MatchesModel;
  constructor() {
    this.teamsModel = new TeamsModel();
    this.matchesModel = new MatchesModel();
  }

  public async teams(): Promise<ITeams[]> {
    const teams = await this.teamsModel.findAll({ attributes: ['id', 'teamName'], raw: true });
    return teams;
  }

  public async formattingMatches(): Promise<SequelizeMatch[]> {
    try {
      const formattedMatches = await this.matchesModel.getModel().findAll({
        where: { inProgress: false },
        attributes: ['homeTeamId', [sequelize.fn('sum', sequelize.col('home_team_goals')),
          'totalHomeGoals'],
        'awayTeamId', [sequelize.fn('sum', sequelize.col('away_team_goals')),
          'totalAwayGoals']],
        group: ['homeTeamId', 'awayTeamId'],
        raw: true,
      });
      return formattedMatches;
    } catch (error) {
      console.log(error);
      throw new CustomError('Error formatting matches.', httpStatus.internalServerError);
    }
  }

  // private calculateTeamStats(formattedMatches: SequelizeMatch[]):
  // { [teamId: number]: { victories: number, draws: number, losses: number } } {
  //   const teamStats: { [teamId: number]: { victories: number, draws: number, losses: number } } = {};

  //   formattedMatches.forEach((match: any) => {
  //     const { homeTeamId } = match;
  //     const { awayTeamId } = match;
  //     const homeGoals = match.totalHomeGoals;
  //     const awayGoals = match.totalAwayGoals;

  //     // Inicializa as estatísticas se ainda não existirem para os times envolvidos na partida
  //     if (!teamStats[homeTeamId]) teamStats[homeTeamId] = { victories: 0, draws: 0, losses: 0 };
  //     if (!teamStats[awayTeamId]) teamStats[awayTeamId] = { victories: 0, draws: 0, losses: 0 };

  //     if (homeGoals > awayGoals) {
  //       teamStats[homeTeamId].victories += 1;
  //       teamStats[awayTeamId].losses += 1;
  //     } else if (homeGoals < awayGoals) {
  //       teamStats[homeTeamId].losses += 1;
  //       teamStats[awayTeamId].victories += 1;
  //     } else {
  //       teamStats[homeTeamId].draws += 1;
  //       teamStats[awayTeamId].draws += 1;
  //     }
  //   });

  //   return teamStats;
  // }

  public async getTotalGoalsByHomeTeam(): Promise<TotalGoalsEntry[]> {
    try {
      const totalGoals = await this.matchesModel.getModel().findAll({
        where: { inProgress: false },
        attributes: ['homeTeamId',
          [sequelize.fn('sum', sequelize.literal('home_team_goals')), 'totalGoals']],
        group: ['homeTeamId'],
        raw: true,
      });

      const totalGoalsByTeam: TotalGoalsEntry[] = totalGoals
        .map((result: SequelizeMatchExtended) => ({
          homeTeamId: result.homeTeamId,
          totalGoals: result.totalGoals || 0,
        }));

      return totalGoalsByTeam;
    } catch (error) {
      throw new CustomError('Error getting goals by home team.', httpStatus.internalServerError);
    }
  }

  public async getTotalGoalsOwnsByHomeTeam(): Promise<TotalGoalsEntry[]> {
    try {
      const totalGoals = await this.matchesModel.getModel().findAll({
        where: { inProgress: false },
        attributes: ['homeTeamId',
          [sequelize.fn('sum', sequelize.literal('away_team_goals')), 'totalGoals']],
        group: ['homeTeamId'],
        raw: true,
      });

      const totalGoalsByTeam: TotalGoalsEntry[] = totalGoals
        .map((result: SequelizeMatchExtended) => ({
          homeTeamId: result.homeTeamId,
          totalGoals: result.totalGoals || 0,
        }));

      return totalGoalsByTeam;
    } catch (error) {
      throw new CustomError('Error getting own goals by team.', httpStatus.internalServerError);
    }
  }

  private static getGoalsFavorForTeam(totalGoalsByHomeTeam: TotalGoalsEntry[], teamId: number):
  number {
    const teamEntry = totalGoalsByHomeTeam
      .find((entry) => entry.homeTeamId === teamId);
    return teamEntry ? teamEntry.totalGoals : 0;
  }

  private static getGoalsOwnForTeam(totalGoalsOwnByHomeTeam: TotalGoalsEntry[], teamId: number):
  number {
    const teamEntry = totalGoalsOwnByHomeTeam
      .find((entry) => entry.homeTeamId === teamId);
    return teamEntry ? teamEntry.totalGoals : 0;
  }

  private static calculateTeamResults(matches: IMatches[], teamId: number) {
    const filteredMatches = matches
      .filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId);

    const result = filteredMatches.reduce((res, match) => {
      const isHomeTeam = match.homeTeamId === teamId;
      const hasWon = (isHomeTeam && match.homeTeamGoals > match.awayTeamGoals)
        || (!isHomeTeam && match.awayTeamGoals > match.homeTeamGoals);

      if (hasWon) {
        res.totalVictories += 1;
      } else if (match.homeTeamGoals === match.awayTeamGoals) {
        res.totalDraws += 1;
      } else {
        res.totalLosses += 1;
      }

      return res;
    }, { totalVictories: 0, totalDraws: 0, totalLosses: 0 });

    return result;
  }

  public async home(): Promise<ServiceResponse<ILeaderboard[] | null>> {
    const teams = await this.teams();
    const goalsFavor = await this.getTotalGoalsByHomeTeam();
    const goalsOwn = await this.getTotalGoalsOwnsByHomeTeam();
    const matches = await this.formattingMatches();

    const leaderboard: ILeaderboard[] = teams.map((team) => ({
      name: team.teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: LeaderboardService.calculateTeamResults(matches, team.id).totalVictories,
      totalDraws: LeaderboardService.calculateTeamResults(matches, team.id).totalDraws,
      totalLosses: LeaderboardService.calculateTeamResults(matches, team.id).totalLosses,
      goalsFavor: +LeaderboardService.getGoalsFavorForTeam(goalsFavor, team.id),
      goalsOwn: +LeaderboardService.getGoalsOwnForTeam(goalsOwn, team.id),
    }));
    return { type: httpStatus.ok, message: 'Success', data: { value: leaderboard } };
  }

  public async getTotalGoalsByTeam(): Promise<TotalGoalsEntry[]> {
    try {
      const totalGoals = await this.matchesModel.getModel().findAll({
        where: { inProgress: false },
        attributes: ['homeTeamId',
          [sequelize.fn('sum', sequelize.literal('home_team_goals + away_team_goals')),
            'totalGoals']],
        group: ['homeTeamId'],
        raw: true,
      });

      const totalGoalsByTeam: TotalGoalsEntry[] = totalGoals
        .map((result: SequelizeMatchExtended) => ({
          homeTeamId: result.homeTeamId,
          totalGoals: result.totalGoals || 0,
        }));

      return totalGoalsByTeam;
    } catch (error) {
      throw new CustomError('Error getting total goals by team.', httpStatus.internalServerError);
    }
  }
}
