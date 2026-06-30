import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeRecordService } from './time-record.service';
import { TimeRecordController } from './time-record.controller';
import { TimeRecord } from './entities/time-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRecord])],
  controllers: [TimeRecordController],
  providers: [TimeRecordService],
  exports: [TimeRecordService],
})
export class TimeRecordModule {}
