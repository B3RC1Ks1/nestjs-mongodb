import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  filePath: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ type: Array, default: [] })
  errorReport: { row: number; message: string; suggestion: string }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
