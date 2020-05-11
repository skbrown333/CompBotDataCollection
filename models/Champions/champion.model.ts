import { model } from "mongoose";
import { IChampionDocument, IChampionModel } from "./champion.types";
import ChampionSchema from "./champion.schema";

export const ChampionModel = model<IChampionDocument, IChampionModel>(
  "champion",
  ChampionSchema
);
