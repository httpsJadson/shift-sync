import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  Index 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RecordType } from '../../common/enums/auxi.enums'; 

@Entity('time_records')
@Index(['userId', 'timestamp']) 
export class TimeRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'enum', enum: RecordType })
  type: RecordType;

  // Dados básicos de auditoria (opcionais)
  @Column({ name: 'device_info', nullable: true })
  deviceInfo: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @ManyToOne(() => User, user => user.timeRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string; 

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}