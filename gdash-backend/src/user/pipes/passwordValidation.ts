import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordConfirmPipe implements PipeTransform {
    transform(value: any) {
        if (value.password !== value.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }
        return value;
    }
}