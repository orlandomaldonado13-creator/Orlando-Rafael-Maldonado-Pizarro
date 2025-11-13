import { Stamp, UserType } from './types';

export const SANTO_TOMAS_SHIELD_URL = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Escudo_de_Santo_Tom%C3%A1s_%28Atl%C3%A1ntico%29.svg';
export const INSTITUTIONAL_EMAIL = 'tesoreria@santotomas-atlantico.gov.co';

export const STAMPS: Stamp[] = [
  {
    id: 'proanciano',
    name: 'Pro-Anciano',
    percentage: 0.04,
    account: '48121755834',
    bank: 'Bancolombia Ahorros',
    appliesTo: [UserType.Natural, UserType.Juridica],
  },
  {
    id: 'procultura',
    name: 'Pro-Cultura',
    percentage: 0.01,
    account: '48121755605',
    bank: 'Bancolombia Ahorros',
    appliesTo: [UserType.Natural, UserType.Juridica],
  },
  {
    id: 'prodeporte',
    name: 'Pro-Deporte',
    percentage: 0.01,
    account: '48115364297',
    bank: 'Bancolombia Ahorros',
    appliesTo: [UserType.Juridica],
  },
];