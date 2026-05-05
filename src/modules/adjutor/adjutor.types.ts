export interface KarmaCheckResult {
  identity: string;
  blacklisted: boolean;
  provider: string;
  payload?: unknown;
}
