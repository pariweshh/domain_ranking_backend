import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { TrancoService } from './tranco.service';
import {
  DomainRankResponse,
  GetTopDomainsDto,
  HealthResponse,
  RankedDomainResponse,
  SearchDomainDto,
} from './tranco.dto';

@Controller()
export class TrancoController {
  private readonly logger = new Logger(TrancoController.name);

  constructor(private readonly trancoService: TrancoService) {}

  @Get('rank/:domain')
  getRank(@Param('domain') domain: string): DomainRankResponse {
    this.logger.log(`Looking up rank for: ${domain}`);
    return this.trancoService.getRank(domain);
  }

  @Get('top')
  getTopDomains(@Query() query: GetTopDomainsDto): RankedDomainResponse[] {
    this.logger.log(`Getting top ${query.limit} domains`);

    return this.trancoService.getTopDomains(query.limit);
  }

  @Get('search')
  searchDomains(@Query() query: SearchDomainDto): RankedDomainResponse[] {
    this.logger.log(`Searching for "${query.q}" with limit ${query.limit}`);

    return this.trancoService.searchDomains(query.q, query.limit);
  }

  @Get('health')
  healthCheck(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
