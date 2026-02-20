declare module "passport-auth0" {
  import { Strategy as PassportStrategy } from "passport-strategy";

  export interface Auth0Profile {
    id: string;
    emails?: Array<{ value: string }>;
    email?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    name?: {
      givenName?: string;
      familyName?: string;
    };
  }

  export interface Auth0StrategyOptions {
    domain: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    state?: boolean;
  }

  export type VerifyCallback = (
    accessToken: string,
    refreshToken: string,
    extraParams: Record<string, unknown>,
    profile: Auth0Profile,
    done: (error: unknown, user?: unknown) => void,
  ) => void | Promise<void>;

  export class Strategy extends PassportStrategy {
    constructor(options: Auth0StrategyOptions, verify: VerifyCallback);
  }
}
