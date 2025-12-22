import { Transform } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
  Matches,
  IsNotEmpty,
} from 'class-validator';
export class DomainLookupDto {
  @IsString()
  @IsNotEmpty({ message: 'Domain is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Matches(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/, {
    message: 'Invalid domain format. Example: google.com',
  })
  domain: string;
}

export class BulkDomainLookupDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((d: string) => d?.toLowerCase().trim())
      : value,
  )
  domains: string[];
}

export class topDomainsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(1000, { message: 'Limit cannot exceed 1000' })
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Offset cannot be negative' })
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number = 0;
}

export class DomainSearchDto {
  @IsString()
  @IsNotEmpty({ message: 'Search query is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  query: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;
}

export class DomainRankResponse {
  domain: string;
  rank: number | null;
  found: boolean;
  listId?: string;
  listDate?: string;
}

export class BulkDomainRankResponse {
  results: DomainRankResponse[];
  totalRequested: number;
  totalFound: number;
  listId?: string;
}

export class TopDomainsResponse {
  domains: Array<{ rank: number; domain: string }>;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  listId?: string;
}

export class DomainSearchResponse {
  results: Array<{ rank: number; domain: string }>;
  query: string;
  count: number;
}

export class ListInfoResponse {
  listId: string;
  totalDomains: number;
  lastUpdated: string;
  source: string;
}

export class ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path?: string;
}
