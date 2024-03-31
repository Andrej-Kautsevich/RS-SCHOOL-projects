import { CarInterface } from '../../types/types';
import getRandomNumber from '../../helpers/getRandomNumber';

const carBrand = [
  'Ferrari',
  'Porsche',
  'Alfa Romeo',
  'Aston Martin',
  'McLaren',
  'Minardi',
  'Renault',
  'Williams',
  'Toyota',
  'Mercedes AMG',
  'Maserati',
  'Jaguar',
];

const carModel = [
  'SF 1000',
  'F1-2000',
  '150º Italia',
  'LaFerrari',
  'F430 Spider',
  'MCL60',
  'MP4/1',
  'Cayenne',
  'Carrera GT',
  'Cayman',
  'Vantage',
  'Vanquish',
  'Senna',
  'Speedtail',
  'Artura',
  '4C Spider',
];

const generateCarData = (): Pick<CarInterface, 'color' | 'name'> => {
  const brand = carBrand[getRandomNumber(0, carBrand.length - 1)];
  const model = carModel[getRandomNumber(0, carModel.length - 1)];
  const name = `${brand} ${model}`;

  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return { name, color };
};

export default generateCarData;
