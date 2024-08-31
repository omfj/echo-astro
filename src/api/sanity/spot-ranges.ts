import { type SanityResult } from "./client";
import { sanityClient } from "sanity:client";

const spotRangesQuery = `*[_type == "happening"
    && _id == $id
    && !(_id in path("drafts.**"))
][0] {
  "spotRanges": spotRanges[] {
    _id,
    spots,
    minYear,
    maxYear,
  }
}.spotRanges`;

export const getSpotRanges = async (id: string) => {
  const result = await sanityClient.fetch<
    SanityResult<
      Array<{
        _id: string;
        spots: number;
        minYear: number;
        maxYear: number;
      }>
    >
  >(spotRangesQuery, {
    id,
  });

  if (!result) {
    return null;
  }

  const maxSpots = result.reduce((acc, spotRange) => {
    return acc + spotRange.spots;
  }, 0);

  return {
    ranges: result,
    maxSpots,
  };
};
