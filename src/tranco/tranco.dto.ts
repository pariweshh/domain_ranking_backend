import { Type } from 'class-transformer';
import {
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
