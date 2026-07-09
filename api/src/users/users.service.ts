import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';
import { UserRole } from 'src/common/enums/auxi.enums';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  async create(createUserDto: CreateUserDto, activeUserRole: string | null) {
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
      if (error.code === '23505') {
        throw new ConflictException(`User with email "${email}" already exists`);
      }
      throw new InternalServerErrorException('Error creating user. Please try again later.');
    }
  }

  async findAll(query: PaginationDto) {
    try {
      const { page = 1, limit = 20, orderDir = 'asc' } = query;
      const skip = (page - 1) * limit;
      const [data, total] = await this.userRepository.findAndCount({
        cache: true,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        order: orderDir === 'asc' ? { createdAt: 'ASC' } : { createdAt: 'DESC' },
      });

      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users. Please try again later.');
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOne(id);
    if(!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if(!user.isActive) {
      throw new BadRequestException('Cannot update an inactive user');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot change role of an admin user');
    } 
    
    try {
      const toUpdate: any = { ...updateUserDto };
      if (toUpdate.password) {
        toUpdate.password = await this.hashingService.hash(toUpdate.password);
      }

      await this.userRepository.update(id, toUpdate);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email already in use by another user');
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user.isActive) {
      throw new BadRequestException('User is already inactive');
    }

    try {
      await this.userRepository.update(id, { isActive: false });
      return { deactivated: true, user: { ...user, isActive: false } };
    } catch (error) {
      throw new InternalServerErrorException('Error deactivating user');
    }
  }
}
