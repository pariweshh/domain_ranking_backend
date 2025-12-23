import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BulkRankItemResponse,
  BulkRankResponse,
  DomainRankResponse,
  RankedDomainResponse,
} from './tranco.dto';
import { parse } from 'csv-parse/sync';
import axios from 'axios';
import AdmZip from 'adm-zip';

@Injectable()
export class TrancoService implements OnModuleInit {
  private readonly logger = new Logger(TrancoService.name);

  private domainToRank: Map<string, number> = new Map();

  private rankedDomains: string[] = [];

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('Initialising TrancoService...');
    await this.loadTrancoData();
    this.logger.log(
      `✅ Loaded ${this.domainToRank.size.toLocaleString()} domains`,
    );
  }

  //   Load tranco data

  private async loadTrancoData(): Promise<void> {
    try {
      const url = this.configService.get<string>(
        'TRANCO_CSV_URL',
        'https://tranco-list.eu/top-1m.csv.zip',
      );

      this.logger.log(`Downloading from: ${url}`);

      //   Download zip
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });

      this.logger.log('Download complete, extracting ZIP...');

      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
      //   unzip
      const zip = new AdmZip(Buffer.from(response.data));
      const zipEntries = zip.getEntries();

      const csvEntry = zipEntries.find((entry) =>
        entry.entryName.endsWith('.csv'),
      );

      if (!csvEntry) {
        throw new Error('No CSV file found in ZIP archive');
      }

      const csvContent = csvEntry.getData().toString('utf-8');

      this.logger.log('Parsing CSV...');

      const records: string[][] = parse(csvContent, {
        skip_empty_lines: true,
      }) as string[][];
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

      // Store each record
      for (const [rankStr, domain] of records) {
        const rank = parseInt(rankStr, 10);
        const normalizedDomain = domain.toLowerCase().trim();

        this.domainToRank.set(normalizedDomain, rank);
        this.rankedDomains.push(normalizedDomain);
      }

      this.logger.log('Tranco data loaded successfully!');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to load Tranco data: ${errorMessage}`);
      throw error;
    }
  }

  //   Get single domain rank

  getRank(domain: string): DomainRankResponse {
    const normalised = domain.toLowerCase().trim();

    // look up in map
    const rank = this.domainToRank.get(normalised);

    return {
      domain: normalised,
      rank: rank ?? null,
    };
  }

  //   get top domains
  getTopDomains(limit: number = 10): RankedDomainResponse[] {
    // cap limit to prevent large responses
    const safeLimit = Math.min(Math.max(1, limit), 100);

    // slice array and map to include rank
    return this.rankedDomains.slice(0, safeLimit).map((domain, index) => ({
      rank: index + 1,
      domain,
    }));
  }
  //   search domains
  searchDomains(query: string, limit: number = 10): RankedDomainResponse[] {
    const normalised = query.toLowerCase().trim();
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const results: RankedDomainResponse[] = [];

    // search through domains in order
    for (
      let i = 0;
      i < this.rankedDomains.length && results.length < safeLimit;
      i++
    ) {
      const domain = this.rankedDomains[i];

      // check if domain contains the query
      if (domain.includes(normalised)) {
        results.push({
          rank: i + 1,
          domain,
        });
      }
    }
    return results;
  }

  private getTier(rank: number | null): string {
    if (rank === null) return 'Unranked';
    if (rank <= 100) return 'Elite';
    if (rank <= 1000) return 'Premium (Top 1k)';
    if (rank <= 10000) return 'Popular (Top 10k)';
    if (rank <= 100000) return 'Notable (Top 100k)';
    return 'Ranked';
  }

  getBulkRanks(domains: string[]): BulkRankResponse {
    const results: BulkRankItemResponse[] = domains.map((domain) => {
      const normalised = domain.toLowerCase().trim();
      const rank = this.domainToRank.get(normalised) ?? null;

      return {
        domain: normalised,
        rank,
        found: rank !== null,
        tier: this.getTier(rank),
      };
    });

    const found = results.filter((r) => r.found).length;

    return {
      results,
      summary: {
        total: results.length,
        found,
        notFound: results.length - found,
      },
    };
  }
}
