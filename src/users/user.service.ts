import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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

    try {
      const newUser = new User();
      newUser.name = createUserDto.name;
      newUser.cpf = createUserDto.cpf;

      return await this.userRepository.create(newUser);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao criar o usuário');
    }
  }

  async findAll() {
    try {
      return await this.userRepository.findAll();
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao buscar usuários');
    }
  }

  async delete(id: string) {
    try {
      return await this.userRepository.delete(id);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }
}
