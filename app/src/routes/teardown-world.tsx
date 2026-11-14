import { teardownWorld } from "~/content/universe";
import { seo } from "~/lib/meta";
import { WorldPage } from "~/universe/WorldPage";

export const meta = () => seo(`${teardownWorld.name} in 3D`, `The ${teardownWorld.name} workshop in 3D. ${teardownWorld.oneLine}`, "/writing/the-teardown");

/** /writing/the-teardown: the newsletter's 3D workshop (not on the Earth, not in the project hub). */
export default function TeardownWorld() {
  return <WorldPage d={teardownWorld} title="Writing" />;
}
