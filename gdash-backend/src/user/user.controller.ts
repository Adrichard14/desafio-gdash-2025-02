import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Headers, UseGuards, UsePipes } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateUserDto } from './create-user.dto';
import { PasswordConfirmPipe } from './pipes/passwordValidation';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UsePipes(PasswordConfirmPipe)
  @Post()
  async addUser(@Body(PasswordConfirmPipe) dto: CreateUserDto) {
    return await this.userService.addUser(dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteOne(id);
  }


  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return await this.userService.update(id, body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Headers('authorization') authHeader: string) {
    console.log(authHeader);
  }
}
