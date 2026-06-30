import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkScheduleService } from './work-schedule.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';

@Controller('work-schedule')
export class WorkScheduleController {
  constructor(private readonly workScheduleService: WorkScheduleService) {}

  @Post()
  create(@Body() createWorkScheduleDto: CreateWorkScheduleDto) {
    return this.workScheduleService.create(createWorkScheduleDto);
  }

  @Get()
  findAll() {
    return this.workScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkScheduleDto: UpdateWorkScheduleDto) {
    return this.workScheduleService.update(+id, updateWorkScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workScheduleService.remove(+id);
  }
}
