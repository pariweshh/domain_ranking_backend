import { TrancoService } from './tranco.service';
import { BulkRankDto, BulkRankResponse, DomainRankResponse, GetTopDomainsDto, HealthResponse, RankedDomainResponse, SearchDomainDto } from './tranco.dto';
export declare class TrancoController {
    private readonly trancoService;
    private readonly logger;
    constructor(trancoService: TrancoService);
    getRank(domain: string): DomainRankResponse;
    getTopDomains(query: GetTopDomainsDto): RankedDomainResponse[];
    searchDomains(query: SearchDomainDto): RankedDomainResponse[];
    healthCheck(): HealthResponse;
    getBulkRanks(body: BulkRankDto): BulkRankResponse;
}
