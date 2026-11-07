// Cloudflare Workers entry. Secrets: `wrangler secret put AI_API_KEY`.
import { handle, type Env } from "./handler";
export default { fetch: (req: Request, env: Env) => handle(req, env) };
