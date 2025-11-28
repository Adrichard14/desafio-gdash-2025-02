import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Headers, UseGuards } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  async addUser(@Body('name') name: string, @Body('email') email: string, @Body('password') password) {
    const id = await this.userService.addUser(name, email, password);
    return { message: 'User added successfully', id };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteOne(id);
  }


  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    const result = await this.userService.update(id, body);
    if (result) {
      return { message: 'User successfully updated', id };
    }
    return new BadRequestException('Ocorreu um erro ao atualizar esse usuário');
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Headers('authorization') authHeader: string) {
    console.log(authHeader);
  }
}
