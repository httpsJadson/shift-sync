import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeRecordService } from './time-record.service';
import { CreateTimeRecordDto } from './dto/create-time-record.dto';
import { UpdateTimeRecordDto } from './dto/update-time-record.dto';

@Controller('time-record')
export class TimeRecordController {
  constructor(private readonly timeRecordService: TimeRecordService) {}

  @Post()
  create(@Body() createTimeRecordDto: CreateTimeRecordDto) {
    return this.timeRecordService.create(createTimeRecordDto);
  }

  @Get()
  findAll() {
    return this.timeRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeRecordDto: UpdateTimeRecordDto) {
    return this.timeRecordService.update(+id, updateTimeRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeRecordService.remove(+id);
  }
}
