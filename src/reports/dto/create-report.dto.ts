import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator"

export class CreateReportDto {

    @IsString()
    make: string

    @IsString()
    model: string

    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number

    @IsLongitude()
    @IsNumber()
    lng: number

    @IsLatitude()
    @IsNumber()
    lat: number

    @Min(0)
    @Max(1000000)
    @IsNumber()
    price: number

}
