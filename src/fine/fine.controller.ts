import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Version,
  Query,
} from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Fine')
@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @ApiOperation({
    summary: 'Create fine',
  })
  @Post()
  @Version('1')
  create(@Body() dto: CreateFineDto) {
    return this.fineService.create(dto);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get all fines',
  })
  @Get()
  @Version('1')
  findAll() {
    return this.fineService.findAll();
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get fines with pagination',
  })
  @Get('page')
  @Version('1')
  paginate(@Query('page') page: number) {
    return this.fineService.paginate(page);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get fine by ID',
  })
  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.fineService.findOne(id);
  }
}
