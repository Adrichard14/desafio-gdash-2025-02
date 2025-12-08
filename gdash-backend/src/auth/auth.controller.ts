import { Body, Controller, Get, Post, Request, Headers, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas.');
        }
        return this.authService.login(user);
    }

    @Post('logout')
    async logout(@Req() req: any) {
        return req;
        // return await this.userService.addUser({})
    }
    // @UseGuards(AuthGuard)
    // @Post('register')
    // async register(@Body() body: { email: string, password: string }) {
    //     return await this.userService.addUser({})
    // }
}
