import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import type { KarmaCheckResult } from './adjutor.types';

export class AdjutorService {
  async checkKarmaBlacklist(identity: string): Promise<KarmaCheckResult> {
    const response = await fetch(
      `${env.ADJUTOR_BASE_URL}/verification/karma/${encodeURIComponent(identity)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${env.ADJUTOR_API_KEY}`,
        },
      },
    );

    if (response.status === 404) {
      return {
        identity,
        blacklisted: false,
        provider: 'adjutor',
      };
    }

    if (!response.ok) {
      throw new AppError('Unable to complete blacklist screening', 503);
    }

    const payload = (await response.json()) as { data?: unknown };
    const blacklisted = Array.isArray(payload.data) ? payload.data.length > 0 : Boolean(payload.data);

    return {
      identity,
      blacklisted,
      provider: 'adjutor',
      payload,
    };
  }
}

export const adjutorService = new AdjutorService();
