import { type SanityResult } from "./client";
import { sanityClient } from "sanity:client";

export const happeningTypes = ["bedpres", "event", "external"] as const;
export type HappeningType = (typeof happeningTypes)[number];

const getHappeningsQuery = (
  opts?: GetHappeningsOptions,
) => `*[_type == "happening"
    && !(_id in path("drafts.**"))
    ${opts?.includePast ? "" : "&& now() < registrationEnd"}
    && happeningType in $types
] | order(registrationStart asc) {
    _id,
    title,
    "type": happeningType
}`;

type GetHappeningsOptions = {
  types?: Array<"bedpres" | "event" | "external">;
  includePast?: boolean;
};

export const getHappenings = async (opts?: GetHappeningsOptions) => {
  const result = await sanityClient.fetch<
    SanityResult<
      Array<{
        _id: string;
        title: string;
        type: HappeningType;
      }>
    >
  >(getHappeningsQuery(opts), {
    types: opts?.types ? opts.types : happeningTypes,
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
