import { Module } from '@nestjs/common';
import { CarsService } from './car.service';
import { CarsController } from './car.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './models/car.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../common/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Car]), JwtModule, FilesModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
