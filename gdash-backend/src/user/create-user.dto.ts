import { IsString, MinLength, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    name: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)
    confirmPassword: string;
}