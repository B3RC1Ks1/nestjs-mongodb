import { Module } from '@nestjs/common';
import { Reservation, ReservationSchema } from 'src/schemas/Reservation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
})
export class ReservationModule {}
