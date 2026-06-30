import { Injectable } from '@nestjs/common';
import { CreateTimeRecordDto } from './dto/create-time-record.dto';
import { UpdateTimeRecordDto } from './dto/update-time-record.dto';

@Injectable()
export class TimeRecordService {
  create(createTimeRecordDto: CreateTimeRecordDto) {
    return 'This action adds a new timeRecord';
  }

  findAll() {
    return `This action returns all timeRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeRecord`;
  }

  update(id: number, updateTimeRecordDto: UpdateTimeRecordDto) {
    return `This action updates a #${id} timeRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeRecord`;
  }
}
