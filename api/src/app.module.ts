import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';
import { TimeRecordModule } from './time-record/time-record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    WorkScheduleModule,
    TimeRecordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
