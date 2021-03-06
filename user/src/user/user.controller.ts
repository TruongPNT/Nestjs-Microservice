import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { FormDataRequest } from 'nestjs-form-data';
// import { AuthGuard } from '@nestjs/passport';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Roles } from '../authorization/roles.decorator';
import { UserRole } from './dto/user-roles.enum';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('users')
// @ApiTags('User')
// @ApiBearerAuth()
// @UseFilters(HttpExceptionFilter)
// @UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Tạo người dùng (ADMIN)
  @Post()
  // @Roles(UserRole.ADMIN)
  @EventPattern('user_created')
  create(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Lấy ra danh sách tất cả người dùng (ADMIN)

  // @Roles(UserRole.ADMIN)
  @MessagePattern({ cmd: 'get_users' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Lấy ra thông tin người dùng theo id (ADMIN)
  @Get(':id')
  // @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // Lấy ra thông tin người dùng theo tài khoản đăng nhập
  @Get(':id')
  findOneForUser(@Req() req) {
    const user = req.user;
    return this.userService.findOneForUser(user);
  }

  // sửa thông tin người dùng (ADMIN)
  @Patch(':id')
  // @Roles(UserRole.ADMIN)
  @FormDataRequest()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // sửa thông tin người dùng theo tài khoản đăng nhập
  @Patch()
  updateForUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const user = req.user;
    return this.userService.updateForUser(updateUserDto, user);
  }

  // xoá người dùng (ADMIN)
  @Delete(':id')
  // @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
