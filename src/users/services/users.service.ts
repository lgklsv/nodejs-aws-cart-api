import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(name: string) {
    return await this.userRepository.findOne({ where: { name } });
  }

  createOne({
    name,
    email,
    password,
  }: {
    name: string;
    email?: string;
    password: string;
  }) {
    const id = randomUUID();

    const user = this.userRepository.create({
      id,
      name,
      email,
      password,
    });

    return this.userRepository.save(user);
  }
}
