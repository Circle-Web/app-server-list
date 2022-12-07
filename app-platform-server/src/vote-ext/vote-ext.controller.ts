import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateVoteExtDto } from './dto/create-vote-ext.dto';
import { VoteExtService } from './vote-ext.service';

@Controller('api/ext/vote')
export class VoteExtController {
  constructor(private readonly voteExtService: VoteExtService) { }

  // 创建投票
  @Post('create')
  create(@Body() createVoteExtDto: CreateVoteExtDto) {
    return this.voteExtService.create(createVoteExtDto);
  }

  // 查看投票详情
  @Get('mainRecord')
  mainRecord(@Query() { id }) {
    return this.voteExtService.getMainRecord(id);
  }

  // 获取历史投票记录
  @Get('historyRecord')
  historyRecord(@Query() { userId }) {
    return this.voteExtService.getHistoryRecord(userId);
  }

  // 选择投票
  @Post('select')
  select(@Body() { id, select, userId }) {
    return this.voteExtService.select(id, select, userId);
  }

  // 结束投票
  @Post('close')
  close(@Body() { id, userId }) {
    return this.voteExtService.close(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voteExtService.remove(+id);
  }
}