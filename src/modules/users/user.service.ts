import { userRepository } from './user.repository';

export class UserService {
  async getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }
}

export const userService = new UserService();
