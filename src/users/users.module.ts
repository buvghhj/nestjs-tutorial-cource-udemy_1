import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({

  imports: [

    TypeOrmModule.forFeature([UserEntity])

  ],

  controllers: [UsersController],

  providers: [

    UsersService,
    AuthService,

  ],

})
export class UsersModule {

  configure(consumer: MiddlewareConsumer) {

    consumer.apply(CurrentUserMiddleware).forRoutes('*')

  }

}
