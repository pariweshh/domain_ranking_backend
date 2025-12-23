export declare class GetTopDomainsDto {
    limit?: number;
}
export declare class SearchDomainDto {
    q: string;
    limit?: number;
}
export declare class BulkRankDto {
    domains: string[];
}
export declare class BulkRankItemResponse {
    domain: string;
    rank: number | null;
    found: boolean;
    tier: string;
}
export declare class BulkRankResponse {
    results: BulkRankItemResponse[];
    summary: {
        total: number;
        found: number;
        notFound: number;
    };
}
export declare class DomainRankResponse {
    domain: string;
    rank: number | null;
}
export declare class RankedDomainResponse {
    rank: number;
    domain: string;
}
export declare class HealthResponse {
    status: string;
    timestamp: string;
}
