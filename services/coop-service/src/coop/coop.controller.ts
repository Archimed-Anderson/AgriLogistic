import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { CoopService } from './coop.service';

@Controller('coop')
export class CoopController {
  constructor(private readonly coopService: CoopService) {}

  @Post()
  createCooperative(@Body() coopDto: any) {
    return this.coopService.createCooperative(coopDto);
  }

  @Get()
  findAllCooperatives(@Query('region') region?: string) {
    return this.coopService.findAllCooperatives(region);
  }

  @Get(':id')
  findOneCooperative(@Param('id') id: string) {
    return this.coopService.findOneCooperative(id);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() memberDto: any) {
    return this.coopService.addMember(id, memberDto);
  }

  @Get(':id/members')
  findAllMembers(@Param('id') id: string) {
    return this.coopService.findAllMembers(id);
  }

  @Post(':id/votes')
  createVote(@Param('id') id: string, @Body() voteDto: any) {
    return this.coopService.createVote(id, voteDto);
  }

  @Get(':id/votes')
  findAllVotes(@Param('id') id: string) {
    return this.coopService.findAllVotes(id);
  }

  @Post(':id/votes/:voteId/cast')
  castVote(@Param('id') id: string, @Param('voteId') voteId: string, @Body() castDto: any) {
    return this.coopService.castVote(id, voteId, castDto);
  }

  @Get(':id/treasury')
  getTreasury(@Param('id') id: string) {
    return this.coopService.getTreasury(id);
  }

  @Post(':id/tokens/distribute')
  distributeTokens(@Param('id') id: string, @Body() distributionDto: any) {
    return this.coopService.distributeTokens(id, distributionDto);
  }

  @Get(':id/production/collective')
  getCollectiveProduction(@Param('id') id: string) {
    return this.coopService.getCollectiveProduction(id);
  }
}
