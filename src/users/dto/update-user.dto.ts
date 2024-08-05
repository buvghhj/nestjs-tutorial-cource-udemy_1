import { IsEmail, IsNotEmpty, IsNumber } from "class-validator"

export class UpdateUserDto {

    id: number

    @IsEmail()
    @IsNotEmpty()
    email: string



}
