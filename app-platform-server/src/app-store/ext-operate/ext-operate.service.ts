import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import { ExtStatus } from '../data/extStatus';
import { UpdateExtDto } from '../dto/update-ext.dto';
import { ExtMainDetailDO } from '../entities/ext-main-detail.entity';
import { ExtVersionDO } from '../entities/ext-version.entity';

@Injectable()
export class ExtOperateService {

    private static EXT_VERSION = '0.0.0'
    constructor(
        @InjectRepository(ExtMainDetailDO)
        private readonly rep: Repository<ExtMainDetailDO>,
        @InjectRepository(ExtVersionDO)
        private readonly versionRep: Repository<ExtVersionDO>,
    ) { }

    async createExt(extAuthorId: number, extName: string) {
        const v = await this.rep.findOne({ where: { extName } });
        if (v) {
            return ResultFactory.create(ResultCode.CREATE_EXT_FAIL_RE_NAME);
        }
        const extVersion = ExtOperateService.EXT_VERSION;
        const _do = this.rep.create({ extName, extAuthorId })
        const { extUuid, extLogo } = await this.rep.save(_do);
        return ResultFactory.success({ extUuid, extName, extLogo, extVersion });
    }

    async reOnlineExt(extAuthorId: number, extUuid: number) {
        const extMainDetail = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        extMainDetail.extStatus = ExtStatus.ONLINE
        this.rep.update(extUuid, extMainDetail)
        return ResultFactory.success()
    }

    async offlineExt(extAuthorId: number, extUuid: number) {
        const extMainDetail = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        extMainDetail.extStatus = ExtStatus.OFFLINE
        this.rep.update(extUuid, extMainDetail)
        return ResultFactory.success()
    }

    async createVersion(extAuthorId: number, extUuid: number, version: string) {
        if (!this.validateVersionFormat(version)) {
            return ResultFactory.create(ResultCode.CREATE_EXT_VERSION_FAIL)
        }
        const extMainDetailDO = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetailDO) {
            return ResultFactory.create(ResultCode.CREATE_EXT_VERSION_FAIL_EXT_NOT_EXIST)
        }
        const _do = this.versionRep.create({ extUuid, extName: extMainDetailDO.extName, extLogo: extMainDetailDO.extLogo, extVersion: version })
        const { extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots,
            keywords, extVersion, createTime, updateTime } = await this.versionRep.save(_do)

        return ResultFactory.success({
            extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots: extMarketSnapshots?.split("#") ?? [],
            keywords: keywords?.split("#") ?? [], extVersion, createTime, updateTime
        })
    }

    validateVersionFormat(version: string) {
        let arr = version.split('.')
        if (arr.length != 3) {
            return false
        }
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            var n = Number(element);
            if (isNaN(n)) {
                return false
            }
        }
        return true
    }

    async updateVersion(extAuthorId: number, dto: UpdateExtDto) {
        const extVersionId = dto.extVersionId
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: versionDO.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        versionDO.extBrief = dto.extBrief
        versionDO.extDescription = dto.extDescription
        versionDO.extLogo = dto.extLogo
        versionDO.extMarketSnapshots = dto.extMarketSnapshots.join("#")
        versionDO.extName = dto.extName
        this.versionRep.update(extVersionId, versionDO)
        return ResultFactory.success()
    }
}
