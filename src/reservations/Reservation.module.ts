import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from 'src/schemas/Reservation.schema';
import { ReservationsService } from './Reservation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationModule {}
