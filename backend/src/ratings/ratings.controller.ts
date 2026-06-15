import { Controller, Post, Put, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  create(@Request() req: any, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(req.user.id, createRatingDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  update(@Param('id') id: string, @Request() req: any, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(id, req.user.id, updateRatingDto);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(storeId);
  }
}
