"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TrancoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrancoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sync_1 = require("csv-parse/sync");
const axios_1 = __importDefault(require("axios"));
const adm_zip_1 = __importDefault(require("adm-zip"));
let TrancoService = TrancoService_1 = class TrancoService {
    configService;
    logger = new common_1.Logger(TrancoService_1.name);
    domainToRank = new Map();
    rankedDomains = [];
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        this.logger.log('Initialising TrancoService...');
        await this.loadTrancoData();
        this.logger.log(`✅ Loaded ${this.domainToRank.size.toLocaleString()} domains`);
    }
    async loadTrancoData() {
        try {
            const url = this.configService.get('TRANCO_CSV_URL', 'https://tranco-list.eu/top-1m.csv.zip');
            this.logger.log(`Downloading from: ${url}`);
            const response = await axios_1.default.get(url, {
                responseType: 'arraybuffer',
                timeout: 60000,
            });
            this.logger.log('Download complete, extracting ZIP...');
            const zip = new adm_zip_1.default(Buffer.from(response.data));
            const zipEntries = zip.getEntries();
            const csvEntry = zipEntries.find((entry) => entry.entryName.endsWith('.csv'));
            if (!csvEntry) {
                throw new Error('No CSV file found in ZIP archive');
            }
            const csvContent = csvEntry.getData().toString('utf-8');
            this.logger.log('Parsing CSV...');
            const records = (0, sync_1.parse)(csvContent, {
                skip_empty_lines: true,
            });
            for (const [rankStr, domain] of records) {
                const rank = parseInt(rankStr, 10);
                const normalizedDomain = domain.toLowerCase().trim();
                this.domainToRank.set(normalizedDomain, rank);
                this.rankedDomains.push(normalizedDomain);
            }
            this.logger.log('Tranco data loaded successfully!');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to load Tranco data: ${errorMessage}`);
            throw error;
        }
    }
    getRank(domain) {
        const normalised = domain.toLowerCase().trim();
        const rank = this.domainToRank.get(normalised);
        return {
            domain: normalised,
            rank: rank ?? null,
        };
    }
    getTopDomains(limit = 10) {
        const safeLimit = Math.min(Math.max(1, limit), 100);
        return this.rankedDomains.slice(0, safeLimit).map((domain, index) => ({
            rank: index + 1,
            domain,
        }));
    }
    searchDomains(query, limit = 10) {
        const normalised = query.toLowerCase().trim();
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const results = [];
        for (let i = 0; i < this.rankedDomains.length && results.length < safeLimit; i++) {
            const domain = this.rankedDomains[i];
            if (domain.includes(normalised)) {
                results.push({
                    rank: i + 1,
                    domain,
                });
            }
        }
        return results;
    }
    getTier(rank) {
        if (rank === null)
            return 'Unranked';
        if (rank <= 100)
            return 'Elite';
        if (rank <= 1000)
            return 'Premium (Top 1k)';
        if (rank <= 10000)
            return 'Popular (Top 10k)';
        if (rank <= 100000)
            return 'Notable (Top 100k)';
        return 'Ranked';
    }
    getBulkRanks(domains) {
        const results = domains.map((domain) => {
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
};
exports.TrancoService = TrancoService;
exports.TrancoService = TrancoService = TrancoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TrancoService);
//# sourceMappingURL=tranco.service.js.map