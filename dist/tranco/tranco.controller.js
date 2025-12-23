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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TrancoController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrancoController = void 0;
const common_1 = require("@nestjs/common");
const tranco_service_1 = require("./tranco.service");
const tranco_dto_1 = require("./tranco.dto");
let TrancoController = TrancoController_1 = class TrancoController {
    trancoService;
    logger = new common_1.Logger(TrancoController_1.name);
    constructor(trancoService) {
        this.trancoService = trancoService;
    }
    getRank(domain) {
        this.logger.log(`Looking up rank for: ${domain}`);
        return this.trancoService.getRank(domain);
    }
    getTopDomains(query) {
        this.logger.log(`Getting top ${query.limit} domains`);
        return this.trancoService.getTopDomains(query.limit);
    }
    searchDomains(query) {
        this.logger.log(`Searching for "${query.q}" with limit ${query.limit}`);
        return this.trancoService.searchDomains(query.q, query.limit);
    }
    healthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
    getBulkRanks(body) {
        this.logger.log(`Bulk lookup for ${body.domains.length} domains`);
        return this.trancoService.getBulkRanks(body.domains);
    }
};
exports.TrancoController = TrancoController;
__decorate([
    (0, common_1.Get)('rank/:domain'),
    __param(0, (0, common_1.Param)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", tranco_dto_1.DomainRankResponse)
], TrancoController.prototype, "getRank", null);
__decorate([
    (0, common_1.Get)('top'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tranco_dto_1.GetTopDomainsDto]),
    __metadata("design:returntype", Array)
], TrancoController.prototype, "getTopDomains", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tranco_dto_1.SearchDomainDto]),
    __metadata("design:returntype", Array)
], TrancoController.prototype, "searchDomains", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", tranco_dto_1.HealthResponse)
], TrancoController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('rank/bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tranco_dto_1.BulkRankDto]),
    __metadata("design:returntype", tranco_dto_1.BulkRankResponse)
], TrancoController.prototype, "getBulkRanks", null);
exports.TrancoController = TrancoController = TrancoController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [tranco_service_1.TrancoService])
], TrancoController);
//# sourceMappingURL=tranco.controller.js.map