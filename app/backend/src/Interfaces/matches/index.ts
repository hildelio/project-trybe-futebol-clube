import { ICRUDModelReader, ICRUDModelCreator } from '../ICRUDModel';
import IMatches from './IMatches';

export interface IMatchesModel extends ICRUDModelReader<IMatches>, ICRUDModelCreator<IMatches> {}
