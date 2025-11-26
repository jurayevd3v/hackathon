import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Version,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { AccidentService } from './accident.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Accident')
@Controller('accident')
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @ApiOperation({
    summary: 'Create accident',
    description: 'Yangi accident yaratadi',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Accident yaratish uchun form-data',
    type: CreateAccidentDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  @Version('1')
  create(
    @Body() dto: CreateAccidentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.accidentService.create(dto, image);
  }

  @ApiOperation({
    summary: 'Get all accidents',
    description: 'Barcha accidentlarni qaytaradi',
  })
  @Get()
  @Version('1')
  findAll() {
    return this.accidentService.findAll();
  }

  @ApiOperation({
    summary: 'Get accident by ID',
    description: 'ID bo‘yicha accidentni qaytaradi',
  })
  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.accidentService.findOne(id);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Update accident by ID',
    description: 'ID bo‘yicha accidentni yangilaydi',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Accident yangilaydi uchun form-data',
    type: UpdateAccidentDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DISPATCHER)
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  @Version('1')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAccidentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.accidentService.update(id, dto, image);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Delete accident by ID',
    description: 'ID bo‘yicha accidentni o‘chiradi',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DISPATCHER)
  @Delete(':id')
  @Version('1')
  delete(@Param('id') id: string) {
    return this.accidentService.delete(id);
  }
}
