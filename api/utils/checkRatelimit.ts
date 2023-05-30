import { Environment, User } from "../types";

const ratelimitTime = 3000;

// Returns false if user is not rate-limited and true if they are
export default async (request: Request, env: Environment): Promise<boolean> => {

    const userIP = request.headers.get("CF-Connecting-IP");
    const currentDate = new Date().getTime();
    const user: User = await env.RATELIMITS.get(userIP, { type: "json" });

    if (!user || currentDate > user.ratelimitedUntil) {
        // If user is not found in rate-limits or the rate limit has expired, add rate-limit
        await env.RATELIMITS.put(userIP, JSON.stringify({ ip: userIP, ratelimitedUntil: currentDate + ratelimitTime }), { expirationTtl: 60 });
        return false;
    } else {
        // User is currently rate-limited
        return true;
    }
};