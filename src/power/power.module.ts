import { Module } from '@nestjs/common';
import { PowerService } from './power.service';
import { PowerController } from './power.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Power } from './models/power.model';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/models/user.model';
import { PowerGateway } from './power.gateway';

@Module({
  imports: [SequelizeModule.forFeature([Power, User]), JwtModule],
  controllers: [PowerController],
  providers: [PowerService, PowerGateway],
})
export class PowerModule {}
