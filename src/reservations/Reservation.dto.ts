import { IsNotEmpty, IsString, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ReservationDto {
  @IsNotEmpty()
  @IsString()
  reservation_id: string;

  @IsNotEmpty()
  @IsString()
  guest_name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['oczekująca', 'zrealizowana', 'anulowana'])
  status: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  check_in_date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  check_out_date: Date;
}