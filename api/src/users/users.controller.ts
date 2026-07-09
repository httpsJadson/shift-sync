import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthTokenGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/jobRole.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/auxi.enums';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.MANAGER)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @ActiveUser('role') activeUserRole: string | null) {
    return this.usersService.create(createUserDto, activeUserRole);
  }

  @Roles(UserRole.MANAGER)
  @Get()
  findAll(
    @Query() query: PaginationDto
  ) {
    return this.usersService.findAll(query);
  }

  @Roles(UserRole.MANAGER)
  @Get(':id')
  findOne(
    @Param('id') id: string, 
    @ActiveUser('sub') activeUserId: string, 
    @ActiveUser('role') activeUserRole: UserRole
  ) {
    if (activeUserRole !== UserRole.ADMIN) {
        if (id !== activeUserId) {
          throw new ForbiddenException('Você só pode visualizar seu próprio perfil');
      }
    }
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.EMPLOYEE)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @ActiveUser('sub') activeUserId: string, 
    @ActiveUser('role') activeUserRole: UserRole
  ) {
    if (activeUserRole !== UserRole.ADMIN) {
        if (id !== activeUserId) {
          throw new ForbiddenException('Você só pode atualizar seu próprio perfil');
      }
    }
    // Prevent non-admin users from changing role or isActive via update
    if (activeUserRole !== UserRole.ADMIN) {
      if ((updateUserDto as any).role !== undefined) delete (updateUserDto as any).role;
      if ((updateUserDto as any).isActive !== undefined) delete (updateUserDto as any).isActive;
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.EMPLOYEE)
  @Delete(':id')
  remove(
    @Param('id') id: string, 
    @ActiveUser('sub') activeUserId: string, 
    @ActiveUser('role') activeUserRole: UserRole
  ) {
    if (activeUserRole !== UserRole.ADMIN) {
        if (id !== activeUserId) {
          throw new ForbiddenException('Você só pode remover seu próprio perfil');
      }
    }
    return this.usersService.remove(id);
  }
}
