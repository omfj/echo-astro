import { type SanityResult } from "./client";
import { sanityClient } from "sanity:client";

export const happeningTypes = ["bedpres", "event", "external"] as const;
export type HappeningType = (typeof happeningTypes)[number];

const getHappeningsQuery = `*[_type == "happening"
    && !(_id in path("drafts.**"))
    && now() < registrationEnd
    && happeningType in $types
] | order(registrationStart asc) {
    _id,
    title,
    "type": happeningType
}`;

export const getHappenings = async (
  types?: Array<"bedpres" | "event" | "external">,
) => {
  const result = await sanityClient.fetch<
    SanityResult<
      Array<{
        _id: string;
        title: string;
        type: HappeningType;
      }>
    >
  >(getHappeningsQuery, {
    types: types ? types : ["bedpres", "event", "external"],
  });

  return result ?? [];
};

const getHappeningQuery = `*[_type == "happening" &&
    _id == $id
    && !(_id in path("drafts.**"))
][0] {
    _id,
    title,
    "type": happeningType,
    body
}`;

export const getHappening = async (id: string) => {
  const result = await sanityClient.fetch<
    SanityResult<{
      _id: string;
      title: string;
      type: HappeningType;
      body: string | null;
    }>
  >(getHappeningQuery, {
    id,
  });

  return result ?? null;
};
