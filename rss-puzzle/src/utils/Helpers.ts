import { localStorageService } from '../services/LocalStorageService';

export const isNotNullable = <T>(element: T | null | undefined): element is T => {
  return typeof element !== 'undefined' && element !== null;
};

export const isAuthUser = () => {
  const userData = localStorageService.getData('user');
  if (userData) return true;
  return false;
};
