export interface IStart {
  velocity: number;
  distance: number;
}

export interface Icar {
  name: string;
  id: number;
  color: string;
}

export interface IWin {
  id: number;
  wins: number;
  time: number;
}

export interface IWinner {
  name: string;
  time: number;
}

export interface IwinnerObj {
  obj: Icar;
  time: number;
  status: boolean;
}
