import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {

    return {
        secret: process.env.JWT_SECRET,
        audi: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUE,
        jwtTTL: Number(process.env.JWT_TTL) || 3600,
        refreshTTL: Number(process.env.JWT_REFRESH_TTL) || 604800,
    }
});
//