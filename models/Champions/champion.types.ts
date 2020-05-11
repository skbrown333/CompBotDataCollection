import { Document, Model } from "mongoose";

export interface IChampion {
  name: string;
  total_magic_dmg: number;
  total_physical_dmg: number;
  total_true_dmg: number;
  total_cc_duration: number;
  total_healing: number;
  total_dmg_taken: number;
  total_dmg_mitigated: number;
  count: number;
}

export interface IChampionDocument extends IChampion, Document {}
export interface IChampionModel extends Model<IChampionDocument> {
  updateOneOrCreate: (
    this: IChampionModel,
    {
      _id,
      name,
    }: {
      _id: number;
      name: string;
      magic_dmg: number;
      physical_dmg: number;
      true_dmg: number;
      cc_duration: number;
      healing: number;
      dmg_taken: number;
      dmg_mitigated: number;
    }
  ) => Promise<IChampionDocument>;
}
