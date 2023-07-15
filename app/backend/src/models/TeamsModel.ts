import ITeams from '../Interfaces/teams/ITeams';
import SequelizeTeam from '../database/models/TeamModel';
import { ITeamsModel } from '../Interfaces/teams';

export default class TeamsModel implements ITeamsModel {
  private model = SequelizeTeam;

  async findAll(): Promise<ITeams[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  async findById(id: number): Promise<ITeams | null> {
    const team = await this.model.findByPk(id);
    return team;
  }
}
