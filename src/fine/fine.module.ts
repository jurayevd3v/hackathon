import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { FineController } from './fine.controller';
import { FineGateway } from './fine.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { Fine } from './models/fine.model';
import { User } from '../user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Fine, User])],
  controllers: [FineController],
  providers: [FineService, FineGateway],
})
export class FineModule {}
