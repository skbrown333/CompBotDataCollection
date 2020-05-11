import { IChampionDocument, IChampionModel } from "./champion.types";

export async function updateOneOrCreate(
  this: IChampionModel,
  params
): Promise<IChampionDocument> {
  const record = await this.findOne({ _id: params._id });
  if (record) {
    record.count++;
    record.total_cc_duration += params.cc_duration;
    record.total_dmg_taken += params.dmg_taken;
    record.total_dmg_mitigated += params.dmg_mitigated;
    record.total_healing += params.healing;
    record.total_magic_dmg += params.magic_dmg;
    record.total_physical_dmg += params.physical_dmg;
    record.total_true_dmg += params.true_dmg;
    record.save();
    return record;
  } else {
    return this.create({
      _id: params._id,
      name: params.name,
      total_healing: params.healing,
      total_dmg_taken: params.dmg_taken,
      total_dmg_mitigated: params.dmg_mitigated,
      total_cc_duration: params.cc_duration,
      total_magic_dmg: params.magic_dmg,
      total_physical_dmg: params.physical_dmg,
      total_true_dmg: params.true_dmg,
    });
  }
}
