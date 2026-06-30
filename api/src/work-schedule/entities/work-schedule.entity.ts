import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('work_schedules')
export class WorkSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'start_time' })
  startTime: string; // Ex: "08:00"

  @Column({ name: 'end_time' })
  endTime: string;   // Ex: "17:00"

  @Column({ name: 'break_duration' })
  breakDuration: number; // Em minutos, ex: 60

  // Configuração específica para array no PostgreSQL
  @Column({ type: 'int', array: true, name: 'working_days' })
  workingDays: number[]; // Ex: [1, 2, 3, 4, 5]

  @OneToOne(() => User, user => user.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // JoinColumn fica no lado "dono" da relação
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}