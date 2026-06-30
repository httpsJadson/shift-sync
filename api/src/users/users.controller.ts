import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from 'node_modules/@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/auxi.enums';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.EMPLOYEE)
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
