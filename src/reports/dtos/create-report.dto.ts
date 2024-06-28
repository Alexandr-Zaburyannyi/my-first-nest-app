import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNumber()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(100000000)
  mileage: number;
}
