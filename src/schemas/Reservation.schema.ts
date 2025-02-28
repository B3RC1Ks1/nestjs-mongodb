import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true, unique: true })
  reservation_id: string;

  @Prop({ required: true })
  guest_name: string;

  @Prop({ required: true, enum: ['oczekująca', 'zrealizowana', 'anulowana'] })
  status: string;

  @Prop({ required: true })
  check_in_date: Date;

  @Prop({ required: true })
  check_out_date: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
