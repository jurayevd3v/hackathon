import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { FilesModule } from './common/files/files.module';
import { User } from './user/models/user.model';
import { AccidentModule } from './accident/accident.module';
import { Accident } from './accident/models/accident.model';
import { FineModule } from './fine/fine.module';
import { PowerModule } from './power/power.module';
import { Power } from './power/models/power.model';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      models: [User, Accident, Power],
      autoLoadModels: true,
      logging: false,
    }),

    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'uploads'),
    }),
    FilesModule,
    JwtModule,
    AuthModule,
    UserModule,
    AccidentModule,
    FineModule,
    PowerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
