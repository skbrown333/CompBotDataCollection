import { Document, Model } from "mongoose";

export interface IMatch {
  match_length: number;
  winning_team: number;
  team_0: Array<number>;
  team_1: Array<number>;
}

export interface IMatchDocument extends IMatch, Document {}
export interface IMatchModel extends Model<IMatchDocument> {
  findOneOrCreate: (
    this: IMatchModel,
    {
      _id,
      match_length,
      winning_team,
      team_0,
      team_1,
    }: {
      _id: number;
      match_length: number;
      winning_team: number;
      team_0: Array<number>;
      team_1: Array<number>;
    }
  ) => Promise<IMatchDocument>;
}
