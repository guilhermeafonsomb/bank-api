import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByCpf(createUserDto.cpf);
    if (existingUser) {
      throw new ConflictException('CPF já cadastrado');
    }

    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.cpf = createUserDto.cpf;

    return this.userRepository.create(newUser);
  }

  async findAll() {
    return this.userRepository.findAll();
  }
}
