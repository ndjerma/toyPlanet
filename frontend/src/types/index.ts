export type ToyType =
  | 'slagalica'
  | 'slikovnica'
  | 'figura'
  | 'karakter'
  | 'edukativna'
  | 'sportska';

export type ReservationStatus = 'rezervisano' | 'pristiglo' | 'otkazano';

export type TargetGroup = 'devojcica' | 'decak' | 'svi';

export interface Review {
  id: string;
  autor: string;
  tekst: string;
  ocena: number; // 1-5
  datum: string;
}

export interface Toy {
  id: string;
  naziv: string;
  opis: string;
  tip: ToyType;
  uzrast: string; // npr. "3-6"
  ciljnaGrupa: TargetGroup;
  datumProizvodnje: string;
  cena: number; // RSD
  recenzije: Review[];
}

export interface User {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  omiljeneVrste: ToyType[];
  lozinka: string;
}

export interface CartItem {
  toyId: string;
  toy: Toy;
  status: ReservationStatus;
  ocena?: number;
  datumRezervacije: string;
}

export interface FilterState {
  naziv: string;
  opis: string;
  tip: ToyType[];
  uzrast: string;
  ciljnaGrupa: TargetGroup | '';
  datumOd: string;
  datumDo: string;
  cenaMin: number;
  cenaMax: number;
  ocenaMin: number;
}
