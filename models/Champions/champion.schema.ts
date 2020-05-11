import { Schema } from "mongoose";
import { updateOneOrCreate } from "./champion.statics";

const options = {
  toJSON: { virtuals: true, transform: toJSON },
  toObject: { virtuals: true },
  versionKey: false,
};
const ChampionSchema = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true, unique: true },
    total_magic_dmg: { type: Number, required: true, default: 0 },
    total_physical_dmg: { type: Number, required: true, default: 0 },
    total_true_dmg: { type: Number, required: true, default: 0 },
    total_cc_duration: { type: Number, required: true, default: 0 },
    total_healing: { type: Number, required: true, default: 0 },
    total_dmg_taken: { type: Number, required: true, default: 0 },
    total_dmg_mitigated: { type: Number, required: true, default: 0 },
    total_deaths: { type: Number, required: true, default: 0 },
    total_kills: { type: Number, required: true, default: 0 },
    total_assists: { type: Number, required: true, default: 0 },
    count: { type: Number, required: true, default: 1 },
  },
  options
);

/* STATICS */
ChampionSchema.statics.updateOneOrCreate = updateOneOrCreate;

/* VIRTUALS */
ChampionSchema.virtual("avg_magic_dmg").get(function () {
  return this.total_magic_dmg / this.count;
});

ChampionSchema.virtual("avg_physical_dmg").get(function () {
  return this.total_physical_dmg / this.count;
});

ChampionSchema.virtual("avg_true_dmg").get(function () {
  return this.total_true_dmg / this.count;
});

ChampionSchema.virtual("avg_cc_duration").get(function () {
  return this.total_cc_duration / this.count;
});

ChampionSchema.virtual("avg_healing").get(function () {
  return this.total_healing / this.count;
});

ChampionSchema.virtual("avg_dmg_taken").get(function () {
  return this.total_dmg_taken / this.count;
});

ChampionSchema.virtual("avg_dmg_mitigated").get(function () {
  return this.total_dmg_mitigated / this.count;
});

ChampionSchema.virtual("avg_deaths").get(function () {
  return this.total_deaths / this.count;
});

ChampionSchema.virtual("avg_kills").get(function () {
  return this.total_kills / this.count;
});

ChampionSchema.virtual("avg_assists").get(function () {
  return this.total_assists / this.count;
});

function toJSON(doc, ret) {
  delete ret._id;
  delete ret.total_cc_duration;
  delete ret.total_dmg_taken;
  delete ret.total_healing;
  delete ret.total_magic_dmg;
  delete ret.total_physical_dmg;
  delete ret.total_true_dmg;
  delete ret.total_dmg_mitigated;
  delete ret.total_deaths;
  delete ret.total_kills;
  delete ret.total_assits;
  delete ret.count;
}

export default ChampionSchema;
