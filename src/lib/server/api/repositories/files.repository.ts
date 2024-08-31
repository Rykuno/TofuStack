import { inject } from "tsyringe";
import { StorageService } from "../services/storage.service";
import { DatabaseProvider } from "../providers/database.provider";
import { eq } from "drizzle-orm";
import { filesTable } from "../databases/tables/files.table";
import { takeFirst, takeFirstOrThrow } from "../common/utils/repository.utils";

export class FilesRepository {
  constructor(
    @inject(StorageService) private readonly storageService: StorageService,
    @inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

  async create(file: File, db = this.db) {
    const asset = await this.storageService.upload(file);
    return db.insert(filesTable).values({ key: asset.key, contentType: asset.type, size: BigInt(asset.size) }).returning().then(takeFirst)
  }

  async findOneById(id: string, db = this.db) {
    return db.select().from(filesTable).where(eq(filesTable.id, id)).then(takeFirst)
  }

  async findOneByIdOrThrow(id: string, db = this.db) {
    return db.select().from(filesTable).where(eq(filesTable.id, id)).then(takeFirstOrThrow)
  }

  async update(id: string, file: File, db = this.db) {
    // upload new file
    const newAsset = await this.storageService.upload(file);
    await db.update(filesTable).set({ key: newAsset.key, contentType: newAsset.type, size: BigInt(newAsset.size) }).where(eq(filesTable.id, id))

    // remove old file
    const oldAsset = await this.findOneByIdOrThrow(id)
    await this.storageService.delete(oldAsset.key)
  }

  async delete(id: string, db = this.db) {
    const asset = await this.findOneByIdOrThrow(id)
    await this.storageService.delete(asset.key)
    await db.delete(filesTable).where(eq(filesTable.id, id))
  }
}