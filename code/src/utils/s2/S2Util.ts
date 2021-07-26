import { S2Cell, S2LatLng, S2LatLngRect, S2RegionCoverer } from "nodes2ts";
import { SearchPropertiesInput } from "../../functions/searchProperties/types";
import { GeoPoint, Property } from "../../types";
import { config } from "./config";
import { Covering } from "./Covering";
import { GeoHashRange } from "./GeoHashRange";

export class S2Util {
	public static makeGeoHash(geoPoint: GeoPoint) {
    const latLng = S2LatLng.fromDegrees(geoPoint.latitude, geoPoint.longitude);
    const cell = S2Cell.fromLatLng(latLng);
    const cellId = cell.id;
    return cellId.id;
  }

  public static makeHashKey(geoHash: Long, hashKeyLength: number = config.HASH_KEY_LENGTH) {
    if (geoHash.lessThan(0)) {
      // Counteract "-" at beginning of geohash.
      hashKeyLength++;
    }

    const geoHashString = geoHash.toString(10);
    const denominator = Math.pow(10, geoHashString.length - hashKeyLength);
    return geoHash.divide(denominator);
  }
	
	public static getBoundingRectangle(input: SearchPropertiesInput): S2LatLngRect {
		const longitude = input.longitude;
		const latitude = input.latitude;
		const radiusInMeter = input.radiusInMeters;

		const centerLatLng = S2LatLng.fromDegrees(latitude, longitude);

		const latReferenceUnit = latitude > 0.0 ? -1.0 : 1.0;
		const latReferenceLatLng = S2LatLng.fromDegrees(latitude + latReferenceUnit,
			longitude);
		const lngReferenceUnit = longitude > 0.0 ? -1.0 : 1.0;
		const lngReferenceLatLng = S2LatLng.fromDegrees(latitude, longitude
			+ lngReferenceUnit);

		const latForRadius = radiusInMeter / (centerLatLng.getEarthDistance(latReferenceLatLng) as any);
		const lngForRadius = radiusInMeter / (centerLatLng.getEarthDistance(lngReferenceLatLng) as any);

		const minLatLng = S2LatLng.fromDegrees(latitude - latForRadius,
			longitude - lngForRadius);
		const maxLatLng = S2LatLng.fromDegrees(latitude + latForRadius,
			longitude + lngForRadius);

		return S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
	}

	public static filterByRadius(properties: Property[], input: SearchPropertiesInput): Property[] {
		const centerPosition = S2LatLng.fromDegrees(input.latitude, input.longitude);

		return properties.filter(property => {
			const longitude = property.location.longitude;
			const latitude = property.location.latitude;

			const propertyPosition: S2LatLng = S2LatLng.fromDegrees(latitude, longitude);
			return centerPosition.getEarthDistance(propertyPosition) <= input.radiusInMeters;
		});
	}

	public static getRangesForRadiusQuery(input: SearchPropertiesInput): GeoHashRange[] {
		const rect = S2Util.getBoundingRectangle(input);
		const coveringCells = new S2RegionCoverer().getCoveringCells(rect);
		const covering = new Covering(coveringCells);
		return covering.getGeoHashRanges()
	}
}
