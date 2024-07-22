import { IRejectValue } from './IRejectValue';

export interface IErrorUser {
  regUser?: null | IRejectValue;
  logUser?: null | IRejectValue;
  getUser?: null | IRejectValue;
  editProfileUser?: null | IRejectValue;
}
