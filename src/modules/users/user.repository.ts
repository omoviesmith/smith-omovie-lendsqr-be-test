export class UserRepository {
  async findByEmail(email: string) {
    return { email };
  }
}

export const userRepository = new UserRepository();
