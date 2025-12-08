import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async findAll() {
    return await this.userModel.find({ deleted: false });
  }

  async addUser(body: CreateUserDto) {
    const { name, email, password } = body;
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('An user with this e-mail already exists. Try again with another e-mail.')
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    return { message: 'User added successfully', id: result.id as string }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email, deleted: false }).select('+password').lean().exec();
  }

  async deleteOne(id: string) {
    return await this.userModel.findByIdAndUpdate(id, { deleted: true }, { new: true });
  }

  async update(id: string, body: any) {
    const { name } = body;
    const result = await this.userModel.findByIdAndUpdate(id, body);
    if (result) {
      return { message: 'User successfully updated', id };
    }
    return new BadRequestException('Ocorreu um erro ao atualizar esse usuário');
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return await this.userModel.findByIdAndUpdate(id, { refreshToken });
  }
}
