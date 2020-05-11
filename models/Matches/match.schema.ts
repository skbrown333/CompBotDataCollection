import { Schema } from "mongoose";
import { findOneOrCreate } from "./match.statics";

const options = { versionKey: false, toJSON: { transform: toJSON } };
const MatchSchema = new Schema(
  {
    _id: { type: String },
    league: { type: String, required: true },
    match_length: { type: Number, required: true },
    winning_team: { type: Number, required: true },
    team_0: [{ type: Number, ref: "champion", required: true }],
    team_1: [{ type: Number, ref: "champion", required: true }],
  },
  options
);

MatchSchema.statics.findOneOrCreate = findOneOrCreate;

function toJSON(doc, ret) {
  delete ret._id;
  delete ret.league;
}

export default MatchSchema;
