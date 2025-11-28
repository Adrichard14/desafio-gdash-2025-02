import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherSchema } from './weather.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Weather', schema: WeatherSchema }])],
  providers: [WeatherService],
  controllers: [WeatherController],
  exports: [WeatherService]
})
export class WeatherModule { }
