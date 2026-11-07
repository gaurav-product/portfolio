import type { Config } from "@react-router/dev/config";
import { staticPaths } from "./src/content/routes-manifest";

/** Static, prerendered site: every route below is written to HTML at build
 *  time, so it works on any static host with no server. */
export default {
  appDirectory: "src",
  ssr: false,
  basename: process.env.BASE_PATH || "/",
  async prerender() {
    return staticPaths();
  },
} satisfies Config;
