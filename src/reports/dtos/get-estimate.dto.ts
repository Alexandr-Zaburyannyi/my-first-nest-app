import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => +value)
  @IsNumber()
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => +value)
  @IsNumber()
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  @Max(100000000)
  mileage: number;
}
