export class AdjutorService {
  async checkKarmaBlacklist(identity: string) {
    return {
      identity,
      blacklisted: false,
      provider: 'adjutor',
    };
  }
}

export const adjutorService = new AdjutorService();
