import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from '../db/data-source';
const cookieSession = require('cookie-session')


@Module({

  imports: [
    ConfigModule.forRoot({

      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`

    }),

    TypeOrmModule.forRoot(dataSourceOptions),

    UsersModule,

    ReportsModule

  ],

  providers: [

    {

      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true })

    }

  ]

})
export class AppModule {

  constructor(private readonly configService: ConfigService) { }

  configure(consumer: MiddlewareConsumer) {

    consumer.apply(cookieSession({ keys: [this.configService.get('COOKIE_KEY')] })).forRoutes('*')

  }

}
