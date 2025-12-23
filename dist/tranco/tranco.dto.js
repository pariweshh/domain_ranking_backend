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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthResponse = exports.RankedDomainResponse = exports.DomainRankResponse = exports.BulkRankResponse = exports.BulkRankItemResponse = exports.BulkRankDto = exports.SearchDomainDto = exports.GetTopDomainsDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class GetTopDomainsDto {
    limit = 10;
}
exports.GetTopDomainsDto = GetTopDomainsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Limit must be an integer value' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(10000, { message: 'Limit must not exceed 10000' }),
    __metadata("design:type", Number)
], GetTopDomainsDto.prototype, "limit", void 0);
class SearchDomainDto {
    q;
    limit = 10;
}
exports.SearchDomainDto = SearchDomainDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'q must be a string value' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'q (search query) is required' }),
    __metadata("design:type", String)
], SearchDomainDto.prototype, "q", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Limit must be an integer value' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(10000, { message: 'Limit must not exceed 10000' }),
    __metadata("design:type", Number)
], SearchDomainDto.prototype, "limit", void 0);
class BulkRankDto {
    domains;
}
exports.BulkRankDto = BulkRankDto;
__decorate([
    (0, class_validator_1.IsArray)({ message: 'domains must be an array' }),
    (0, class_validator_1.ArrayMaxSize)(50, { message: 'Maximum 50 domains allowed per request' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each domain must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ each: true, message: 'Domain cannot be empty' }),
    __metadata("design:type", Array)
], BulkRankDto.prototype, "domains", void 0);
class BulkRankItemResponse {
    domain;
    rank;
    found;
    tier;
}
exports.BulkRankItemResponse = BulkRankItemResponse;
class BulkRankResponse {
    results;
    summary;
}
exports.BulkRankResponse = BulkRankResponse;
class DomainRankResponse {
    domain;
    rank;
}
exports.DomainRankResponse = DomainRankResponse;
class RankedDomainResponse {
    rank;
    domain;
}
exports.RankedDomainResponse = RankedDomainResponse;
class HealthResponse {
    status;
    timestamp;
}
exports.HealthResponse = HealthResponse;
//# sourceMappingURL=tranco.dto.js.map