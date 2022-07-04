import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
    ]),
    NestjsFormDataModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
