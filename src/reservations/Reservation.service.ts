import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from 'src/schemas/Reservation.schema';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async updateIfExists(reservationData: any) {
    const { reservation_id } = reservationData;
    const existing = await this.reservationModel
      .findOne({ reservation_id })
      .exec();
    if (existing) {
      existing.status = reservationData.status;
      existing.check_in_date = reservationData.check_in_date;
      existing.check_out_date = reservationData.check_out_date;
      return await existing.save();
    }
    return null;
  }

  async addOrUpdate(reservationData: any) {
    const { reservation_id } = reservationData;
    const existing = await this.reservationModel
      .findOne({ reservation_id })
      .exec();
    if (existing) {
      existing.guest_name = reservationData.guest_name;
      existing.status = reservationData.status;
      existing.check_in_date = reservationData.check_in_date;
      existing.check_out_date = reservationData.check_out_date;
      return await existing.save();
    } else {
      const newReservation = new this.reservationModel(reservationData);
      return await newReservation.save();
    }
  }
}
