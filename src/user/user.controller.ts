import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'DISPATCHER - Create user',
    description: 'Foydalanuvchini yaratadi',
  })
  @Roles(UserRole.DISPATCHER)
  @Post()
  @Version('1')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get all users',
    description: 'Barcha foydalanuvchilarni qaytaradi',
  })
  @Roles(UserRole.DISPATCHER)
  @Get()
  @Version('1')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get users with pagination',
    description: 'Foydalanuvchilarni sahifalash bilan qaytaradi',
  })
  @Roles(UserRole.DISPATCHER)
  @Get('page')
  @Version('1')
  paginate(@Query('page') page: number) {
    return this.userService.paginate(page);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get user by ID',
    description: 'ID bo‘yicha foydalanuvchini qaytaradi',
  })
  @Roles(UserRole.DISPATCHER)
  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Update user by ID',
    description: 'ID bo‘yicha foydalanuvchini yangilaydi',
  })
  @Roles(UserRole.DISPATCHER)
  @Put(':id')
  @Version('1')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Delete user by ID',
    description: 'ID bo‘yicha foydalanuvchini o‘chiradi',
  })
  @Roles(UserRole.DISPATCHER)
  @Delete(':id')
  @Version('1')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Change user password',
    description: 'ID bo‘yicha foydalanuvchi parolini o‘zgartiradi',
  })
  @Roles(UserRole.DISPATCHER)
  @Post('change-password/:id')
  @Version('1')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Reset user password',
    description: 'ID bo‘yicha foydalanuvchi parolini reset qiladi',
  })
  @Roles(UserRole.DISPATCHER)
  @Post('reset-password/:id')
  @Version('1')
  resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(id, resetPasswordDto);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get all user by Role',
    description: 'Role bo‘yicha barcha foydalanuvchilarni qaytaradi',
  })
  @Roles(UserRole.DISPATCHER)
  @Get('role/:role')
  @Version('1')
  findRole(@Param('role') role: string) {
    return this.userService.findRole(role);
  }
}
