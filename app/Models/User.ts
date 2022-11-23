import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Crypto from 'App/Helpers/Crypto'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: String

  @column()
  public password: String

  @column()
  public email: String

  @column()
  public address: String

  @column()
  public phone: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async encryptPassword (user: User) {
    var crypto = new Crypto();
    user.password = await crypto.encrypt(user.password);
  }
}
