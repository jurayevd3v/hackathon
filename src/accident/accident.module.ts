import { Module } from '@nestjs/common';
import { AccidentService } from './accident.service';
import { AccidentController } from './accident.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Accident } from './models/accident.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../common/files/files.module';
import { AccidentGateway } from './accident.gateway';
import { User } from '../user/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Accident, User]),
    JwtModule,
    FilesModule,
  ],
  controllers: [AccidentController],
  providers: [AccidentService, AccidentGateway],
})
export class AccidentModule {}
