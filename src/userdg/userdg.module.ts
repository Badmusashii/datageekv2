import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserdgService } from './userdg.service';
import { UserdgController } from './userdg.controller';
import { Userdg } from './entities/userdg.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Userdg])],
  controllers: [UserdgController],
  providers: [UserdgService],
  exports: [UserdgService],
})
export class UserdgModule {}
