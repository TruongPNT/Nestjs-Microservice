import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './dto/user-roles.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { full_name, age, address, email, password } = createUserDto;
    // hash password
    const result = await this.usersRepository.findOne({ email: email });
    if (result) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Email already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      full_name,
      age,
      address,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      isActive: false,
    });
    await this.usersRepository.save(user);
    return {
      code: 200,
      message: 'Create user successful',
      data: user,
    };
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ id: id });
  }

  findOneForUser(user: User) {
    if (!user) throw new BadRequestException('You need to login first');
    return user;
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({ email: email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ id: id });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.save({ ...user, ...updateUserDto });
    return {
      code: 200,
      message: 'Update user successful',
      data: user,
    };
  }

  async updateForUser(updateUserDto: UpdateUserDto, user: User) {
    const result = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
    if (result)
      return { code: 200, message: 'Update successful', data: result };
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ id: id });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.softRemove(user);
    return {
      code: 200,
      message: 'User delete successful',
    };
  }

  async verifyEmail(email: string) {
    const user = await this.usersRepository.findOne({ email: email });
    if (user) {
      return await this.usersRepository.save({
        ...user,
        isActive: true,
      });
    }
  }

  async updatePassword(email: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ email: email });
    if (!user) throw new NotFoundException('User not found');
    const salt = await bcrypt.genSalt();
    const hasPassword = await bcrypt.hash(newPassword, salt);
    return await this.usersRepository.save({
      ...user,
      password: hasPassword,
    });
  }
}
