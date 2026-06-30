import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';
import { UserRole } from 'src/common/enums/auxi.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  readonly findByEmail = async (email: string) => {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto, activeUserRole: string) {
    const { password, email, name, role, isActive } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email "${email}" already exists`);
    }

    try {
      const password_hash = await this.hashingService.hash(password);
      const userRole = activeUserRole === UserRole.ADMIN ? (role ?? UserRole.EMPLOYEE) : UserRole.EMPLOYEE;

      const user = this.userRepository.create({
        email,
        name,
        role: userRole as UserRole,
        password: password_hash,
        isActive,
      });

      const savedUser = await this.userRepository.save(user);

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };
      
    } catch (error: any) {
      throw new InternalServerErrorException('Error creating user. Please try again later.');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.delete(id);
  }
}
