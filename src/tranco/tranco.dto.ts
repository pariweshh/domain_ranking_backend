import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetTopDomainsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer value' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(10000, { message: 'Limit must not exceed 10000' })
  limit?: number = 10;
}

export class SearchDomainDto {
  @IsString({ message: 'q must be a string value' })
  @IsNotEmpty({ message: 'q (search query) is required' })
  q: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer value' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(10000, { message: 'Limit must not exceed 10000' })
  limit?: number = 10;
}

export class BulkRankDto {
  @IsArray({ message: 'domains must be an array' })
  @ArrayMaxSize(50, { message: 'Maximum 50 domains allowed per request' })
  @IsString({ each: true, message: 'Each domain must be a string' })
  @IsNotEmpty({ each: true, message: 'Domain cannot be empty' })
  domains: string[];
}

export class BulkRankItemResponse {
  domain: string;
  rank: number | null;
  found: boolean;
  tier: string;
}

export class BulkRankResponse {
  results: BulkRankItemResponse[];
  summary: {
    total: number;
    found: number;
    notFound: number;
  };
}

export class DomainRankResponse {
  domain: string;
  rank: number | null;
}

export class RankedDomainResponse {
  rank: number;
  domain: string;
}

export class HealthResponse {
  status: string;
  timestamp: string;
}
