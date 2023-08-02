import SequelizeMatch from '../../database/models/MatchModel';

export default interface SequelizeMatchExtended extends SequelizeMatch {
  teamId?: number;
  totalGoals?: number;
}
