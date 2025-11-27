import { Controller, Get, Post, Body, Param, Version } from '@nestjs/common';
import { AccidentService } from './accident.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Accident')
@Controller('accident')
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @ApiOperation({
    summary: 'Create accident',
    description: 'Yangi accident yaratadi',
  })
  @Post()
  @Version('1')
  create(@Body() dto: CreateAccidentDto) {
    return this.accidentService.create(dto);
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
}
