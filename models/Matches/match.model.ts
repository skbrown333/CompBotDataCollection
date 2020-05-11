import { model } from "mongoose";
import { IMatchDocument, IMatchModel } from "./match.types";
import MatchSchema from "./match.schema";

export const MatchModel = model<IMatchDocument, IMatchModel>(
  "match",
  MatchSchema
);
