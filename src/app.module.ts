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
import { HeaderModule } from './header/header.module';
import { Header } from './header/models/header.model';
import { CarsModule } from './cars/car.module';
import { Car } from './cars/models/car.model';
import { ProductsModule } from './products/products.module';
import { Product } from './products/models/product.model';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASS),
      database: process.env.POSTGRES_DB,
      models: [User, Header, Car, Product],
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
    HeaderModule,
    CarsModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
