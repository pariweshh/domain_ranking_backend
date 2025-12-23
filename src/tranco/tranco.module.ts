import { Module } from '@nestjs/common';
import { TrancoService } from './tranco.service';
import { TrancoController } from './tranco.controller';

@Module({
  controllers: [TrancoController],
  providers: [TrancoService],
})
export class TrancoModule {}
