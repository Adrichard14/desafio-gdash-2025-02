import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGlobalModule } from './auth/jwt.module';
import { PokeapiModule } from './pokeapi/pokeapi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_DATABASE_URL'),
      }),
    }),
    JwtGlobalModule,
    UserModule,
    AuthModule,
    WeatherModule,
    PokeapiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }