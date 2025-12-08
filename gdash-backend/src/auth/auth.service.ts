import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user?.password);
            if (passwordMatch) {
                const { password, ...result } = user;
                return result
            }
        }
        return null;
    }

    async login(user) {
        const payload = { sub: user._id.toString(), email: user.email, admin: user.admin };

        const access_token = this.jwtService.sign(payload, {
            expiresIn: '60m',
        });
        const refresh_token = this.jwtService.sign({ sub: user._id.toString() }, {
            expiresIn: '30d',
        });
        await this.userService.updateRefreshToken(user._id.toString(), refresh_token);
        return { user, access_token, refresh_token };
    }

    async logout(user) {
        return await this.userService.updateRefreshToken(user._id.toString(), null);
    }
}
