import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import { UserDO } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserDO)
    private readonly userRepository: Repository<UserDO>,
  ) { }

  async register(username: string, account: string, password: string) {
    let user = await this.userRepository.findOne({ where: { account } })
    if (user) {
      return ResultFactory.create(ResultCode.REGIESTER_FAIL)
    }
    if (!username) {
      username = '默认用户昵称'
    }
    user = this.userRepository.create({ username, account, password })
    await this.userRepository.save(user)
    return ResultFactory.success();
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(account: string) {
    return this.userRepository.findOne({
      where: { account },
    });
  }

}