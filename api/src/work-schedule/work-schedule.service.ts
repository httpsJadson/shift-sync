import { Injectable } from '@nestjs/common';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';

@Injectable()
export class WorkScheduleService {
  create(createWorkScheduleDto: CreateWorkScheduleDto) {
    return 'This action adds a new workSchedule';
  }

  findAll() {
    return `This action returns all workSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workSchedule`;
  }

  update(id: number, updateWorkScheduleDto: UpdateWorkScheduleDto) {
    return `This action updates a #${id} workSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} workSchedule`;
  }
}
