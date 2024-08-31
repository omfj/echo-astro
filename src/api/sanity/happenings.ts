import { type SanityResult } from "./client";
import { sanityClient } from "sanity:client";

const getHappeningsQuery = `*[_type == "happening"
    && !(_id in path("drafts.**"))
    && now() < registrationEnd
    && happeningType in $types
] | order(registrationStart asc) {
    _id,
    title
}`;

export const getHappenings = async (type?: "bedpres" | "event") => {
  const result = await sanityClient.fetch<
    SanityResult<
      Array<{
        _id: string;
        title: string;
      }>
    >
  >(getHappeningsQuery, {
    types: type ? [type] : ["bedpres", "event"],
  });

  return result ?? [];
};

const getHappeningQuery = `*[_type == "happening" &&
    _id == $id
    && !(_id in path("drafts.**"))
][0] {
    _id,
    title,
    body
}`;

export const getHappening = async (id: string) => {
  const result = await sanityClient.fetch<
    SanityResult<{
      _id: string;
      title: string;
      body: string | null;
    }>
  >(getHappeningQuery, {
    id,
  });

  return result ?? null;
};
