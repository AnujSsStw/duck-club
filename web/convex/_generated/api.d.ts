/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as charts from "../charts.js";
import type * as data_view from "../data_view.js";
import type * as fuckint_types from "../fuckint_types.js";
import type * as http from "../http.js";
import type * as hunts from "../hunts.js";
import type * as huntsAllData from "../huntsAllData.js";
import type * as init from "../init.js";
import type * as q from "../q.js";
import type * as queries_data from "../queries/data.js";
import type * as queries_species from "../queries/species.js";
import type * as queries_subHunt from "../queries/subHunt.js";
import type * as subHunts from "../subHunts.js";
import type * as upload_things from "../upload_things.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  charts: typeof charts;
  data_view: typeof data_view;
  fuckint_types: typeof fuckint_types;
  http: typeof http;
  hunts: typeof hunts;
  huntsAllData: typeof huntsAllData;
  init: typeof init;
  q: typeof q;
  "queries/data": typeof queries_data;
  "queries/species": typeof queries_species;
  "queries/subHunt": typeof queries_subHunt;
  subHunts: typeof subHunts;
  upload_things: typeof upload_things;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
