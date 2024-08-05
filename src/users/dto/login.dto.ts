import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(16)
    password: string

}
