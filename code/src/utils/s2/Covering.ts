import { S2CellId } from "nodes2ts";
import { config } from "./config";
import { GeoHashRange } from "./GeoHashRange";

export class Covering {
  private cellIds: S2CellId[];

  constructor(cellIds: S2CellId[]) {
    this.cellIds = cellIds;
  }

  public getGeoHashRanges(hashKeyLength: number = config.HASH_KEY_LENGTH) {
    const ranges: GeoHashRange[] = [];
    this.cellIds.forEach((outerRange) => {
      const hashRange = new GeoHashRange(
        outerRange.rangeMin().id,
        outerRange.rangeMax().id
      );
      ranges.push(...hashRange.trySplit(hashKeyLength));
    });
    return ranges;
  }
}
