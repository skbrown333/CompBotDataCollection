import { IMatchDocument, IMatchModel } from "./match.types";

export async function findOneOrCreate(
  this: IMatchModel,
  params
): Promise<IMatchDocument> {
  const record = await this.findOne(params)
    .populate("team_0")
    .populate("team_1");
  if (record) {
    return record;
  } else {
    let record = await this.create(params);
    record = await record.populate("team_0").populate("team_1").execPopulate();
    return record;
  }
}
