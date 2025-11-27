import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Version,
  Query,
} from '@nestjs/common';
import { PowerService } from './power.service';
import { CreatePowerDto } from './dto/create-power.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Power')
@Controller('power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

  @ApiOperation({
    summary: 'Create power',
  })
  @Post()
  @Version('1')
  create(@Body() dto: CreatePowerDto) {
    return this.powerService.create(dto);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get all powers',
  })
  @Get()
  @Version('1')
  findAll() {
    return this.powerService.findAll();
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get powers with pagination',
  })
  @Get('page')
  @Version('1')
  paginate(@Query('page') page: number) {
    return this.powerService.paginate(page);
  }

  @ApiOperation({
    summary: 'DISPATCHER - Get power by ID',
  })
  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.powerService.findOne(id);
  }
}
