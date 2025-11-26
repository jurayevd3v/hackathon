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
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { CarsService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-auth-decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Cars')
@Controller('car')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiOperation({
    summary: 'DISPATCHER - Create car',
    description: 'Yangi car yaratadi',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Car yaratish uchun form-data',
    type: CreateCarDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DISPATCHER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageOne', maxCount: 1 },
      { name: 'imageTwo', maxCount: 1 },
    ]),
  )
  @Post()
  @Version('1')
  create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles()
    files: {
      imageOne?: Express.Multer.File[];
      imageTwo?: Express.Multer.File[];
    },
  ) {
    return this.carsService.create(
      createCarDto,
      files.imageOne?.[0],
      files.imageTwo?.[0],
    );
  }

  @ApiOperation({
    summary: 'Get all car',
    description: 'Barcha carlarni qaytaradi',
  })
  @Get()
  @Version('1')
  findAll() {
    return this.carsService.findAll();
  }

  @ApiOperation({
    summary: 'Get car by ID',
    description: 'ID bo‘yicha carni qaytaradi',
  })
  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get car by key',
    description: 'ID bo‘yicha carni qaytaradi',
  })
  @Get('key/:key')
  @Version('1')
  findKey(@Param('key') key: string) {
    return this.carsService.findKey(key);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Update car by ID',
    description: 'ID bo‘yicha carni yangilaydi',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Car yangilaydi uchun form-data',
    type: UpdateCarDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DISPATCHER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageOne', maxCount: 1 },
      { name: 'imageTwo', maxCount: 1 },
    ]),
  )
  @Put(':id')
  @Version('1')
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFiles()
    files: {
      imageOne?: Express.Multer.File[];
      imageTwo?: Express.Multer.File[];
    },
  ) {
    return this.carsService.update(
      id,
      updateCarDto,
      files.imageOne?.[0],
      files.imageTwo?.[0],
    );
  }

  @ApiOperation({
    summary: 'DISPATCHER - Delete car by ID',
    description: 'ID bo‘yicha carni o‘chiradi',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DISPATCHER)
  @Delete(':id')
  @Version('1')
  delete(@Param('id') id: string) {
    return this.carsService.delete(id);
  }
}
