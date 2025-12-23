import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BulkRankResponse, DomainRankResponse, RankedDomainResponse } from './tranco.dto';
export declare class TrancoService implements OnModuleInit {
    private configService;
    private readonly logger;
    private domainToRank;
    private rankedDomains;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private loadTrancoData;
    getRank(domain: string): DomainRankResponse;
    getTopDomains(limit?: number): RankedDomainResponse[];
    searchDomains(query: string, limit?: number): RankedDomainResponse[];
    private getTier;
    getBulkRanks(domains: string[]): BulkRankResponse;
}
