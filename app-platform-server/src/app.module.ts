import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppStoreModule } from './app-store/app-store.module';
import { ExtOperateModule } from './app-store/ext-operate/ext-operate.module';
import { ExtQueryModule } from './app-store/ext-query/ext-query.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/index';
import { ImModule } from './im/im.module';
import { QiNiuModule } from './qiniu/qi-niu.module';
import { RobotExtModule } from './robot-ext/robot-ext.module';
import { RobotModule } from './robot/robot.module';
import { SignExtModule } from './sign-ext/sign-ext.module';
import { TagService } from './tag/tag.service';
import { UploadExtCodeModule } from './upload-ext-code/upload-ext-code.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { VoteExtModule } from './vote-ext/vote-ext.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    //配置数据库链接
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          entities: [path.join(__dirname, './**/*.entity{.ts,.js}')],
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    ImModule,
    AuthModule,
    UserModule,
    AppStoreModule,
    ExtQueryModule,
    ExtOperateModule,
    SignExtModule,
    QiNiuModule,
    RobotExtModule,
    VoteExtModule,
    RobotModule,
    UploadExtCodeModule
  ],
  controllers: [UserController],
  providers: [TagService],
})
export class AppModule { }
