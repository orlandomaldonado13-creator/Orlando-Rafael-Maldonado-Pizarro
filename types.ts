
export enum UserType {
  Natural = 'natural',
  Juridica = 'juridica',
}

export interface Stamp {
  id: string;
  name: string;
  percentage: number;
  account: string;
  bank: string;
  appliesTo: UserType[];
}

export interface CalculationResult {
  stamp: Stamp;
  value: number;
}

export interface ContributorInfo {
  name: string;
  docType: string;
  docNumber: string;
  contractNumber: string;
}
