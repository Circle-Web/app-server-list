import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotCreatedDO } from 'src/robot-ext/entities/robot-created.entity';
import { ImController } from './im.controller';
import { ImService } from './im.service';
import { BaiduTranslateService } from './translate.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        timeout: config.get('http.timeout')
      }),
      inject: [
        ConfigService
      ]
    }),
    TypeOrmModule.forFeature([RobotCreatedDO])
  ],
  providers: [ImService, BaiduTranslateService],
  exports: [ImService],
  controllers: [ImController]
})
export class ImModule { }
