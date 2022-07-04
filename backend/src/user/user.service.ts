import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('USER') public userClient: ClientProxy) {}
  async create(createUserDto: CreateUserDto) {
    // const result = await lastValueFrom(
    //   this.userClient.send('user_created', createUserDto),
    // );
    return this.userClient.send({ cmd: 'user_created' }, createUserDto);
  }

  findAll() {
    return this.userClient.send({ cmd: 'get_users' }, {});
  }

  findOne(id: string) {
    return this.userClient.send({ cmd: 'get_user' }, id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const data = { id, updateUserDto };
    return this.userClient.send({ cmd: 'user_update' }, data);
  }

  remove(id: string) {
    return this.userClient.send({ cmd: 'user_remove' }, id);
  }
}
