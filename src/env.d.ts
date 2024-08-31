/// <reference path="../.astro/types.d.ts" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
  interface Locals {
    user: import("./api/users").UserInfo | null;
  }
}
