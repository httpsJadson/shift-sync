import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany, 
  OneToOne 
} from 'typeorm';
import { WorkSchedule } from '../../work-schedule/entities/work-schedule.entity';
import { TimeRecord } from '../../time-record/entities/time-record.entity';
import { UserRole } from '../../common/enums/auxi.enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relacionamento 1:1 com a Jornada de Trabalho
  @OneToOne(() => WorkSchedule, schedule => schedule.user)
  schedule: WorkSchedule;

  // Relacionamento 1:N com os Registros de Ponto
  @OneToMany(() => TimeRecord, record => record.user)
  timeRecords: TimeRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}