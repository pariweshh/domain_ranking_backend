import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TrancoController],
  providers: [TrancoService],
  exports: [TrancoService],
})
export class TrancoModule {}
