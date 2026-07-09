import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';
import { TimeRecordModule } from './time-record/time-record.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // prefer project root when running from compiled/dist or ts-node
        join(__dirname, '../../.env'),
        // fallback to api/.env when running from api folder
        join(__dirname, '../.env'),
        // final fallback to cwd
        '.env',
      ],
    }),
    DatabaseModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    UsersModule,
    WorkScheduleModule,
    TimeRecordModule,

  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
