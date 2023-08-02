import { CreateOptions } from 'sequelize';
import { ID } from '../index';

export interface ICRUDModelCreator<T> {
  create(data: Partial<T>, options?: CreateOptions): Promise<T>,
}

export interface ICRUDModelReader<T> {
  findAllTeamNames?(): Promise<T[]>,
  findById?(id: ID): Promise<T | null>,
  findOne?(email: string): Promise<T | null>,
}

export interface ICRUDModelUpdater<T> {
  update(id: ID, data: Partial<T>): Promise<T | null>,
}

export interface ICRUDModelDeleter {
  delete(id: ID): Promise<number>,
}

export interface ICRUDModel<T>
  extends ICRUDModelCreator<T>, ICRUDModelReader<T>, ICRUDModelUpdater<T>,
  ICRUDModelDeleter { }
