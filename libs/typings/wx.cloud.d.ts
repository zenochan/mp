export {}
declare global
{
  namespace wx
  {
    export interface Point {}

    export interface Command
    {
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/command.geoNear.html
       */
      geoNear(options: {
        geometry: Point // 点的地理位置
        maxDistance?: number // 选填，最大距离，单位为米
        minDistance?: number // 选填，最小距离，单位为米
      }): Command

      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/command.geoWithin.html
       */
      geoWithin(options: { geometry: any })

      eq(value: any): Command

      neq(value: any): Command

      lt(value: number | Date): Command

      lte(value: number | Date): Command

      gt(value: number | Date): Command

      gte(value: number | Date): Command

      in(values: any[]): Command

      nin(values: any[]): Command

      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/command.and.html
       * @param values
       */
      and(...values: Command[]): Command

      or(...values: Command[]): Command

      set(value: any): Command

      remove(): Command

      inc(value: number): Command

      mul(value: number): Command

      push(...values: []): Command

      pop(): Command

      shift(): Command

      unshift(...values: []): Command
    }

    export interface Database
    {
      /**
       * @param name 集合名称
       */
      collection(name: string): Collection

      command: Command

      Geo: {
        Point(lat: number, lng: number): Point
      }
    }

    export interface FieldFilter
    {
      /**
       * #### 方法接受一个必填字段用于指定需返回的字段
       *
       * - 返回 description, done 和 progress 三个字段
       * ```
       * const db = wx.cloud.database()
       * db.collection('todos').field({
       *   description: true,
       *   done: true,
       *   progress: true
       * })
       * .get()
       * .then(console.log)
       * .catch(console.error)
       * ```
       * @param definition
       */
      field(definition: { [key: string]: true }): this
    }

    export interface Query extends FieldFilter
    {
      orderBy(fieldName: string, order: string): Query

      limit(max: number): Query

      skip(offset: number): Query
    }

    export interface Collection extends Query
    {
      doc(id: string | number): Document

      get<T>(): Promise<{ data: T[] }>

      /**
       * ```
       * db.collection('todos').add({
       *   // data 字段表示需新增的 JSON 数据
       *   data: {
       *     description: "learn cloud database",
       *     due: new Date("2018-09-01"),
       *     tags: [
       *       "cloud",
       *       "database"
       *     ],
       *     location: new db.Geo.Point(113, 23),
       *     done: false
       *   }
       * }).then(res => {
       *   console.log(res)
       * }).catch(console.error)
       * ```
       */
      add<T>(options: { data: T }): Promise<{ _id: string | number }>

      count(): Promise<{ total: number }>

      /**
       * ```
       * const db = wx.cloud.database()
       * db.collection('todos').where({
       *   done: false,
       *   progress: 50
       * }).get({
       *   success: console.log,
       *   fail: console.error
       * })
       *
       * ```
       * @param rule 用于定义筛选条件
       */
      where(rule: object): Query

      field()
    }

    export interface Document extends FieldFilter
    {
      get<T>(): Promise<T>

      set<T>(data: T): Promise<any>

      update<T>(data: T): Promise<any>

      remove(): Promise<any>
    }

    namespace cloud
    {

      function init(options?: {
        env?: string | {
          database?: string
          storage?: string
          functions?: string
        },
        traceUser?: boolean
      });

      /**
       * ```
       * const db = wx.cloud.database()
       *
       * const testDB = wx.cloud.database({
       *   env: 'test'
       * })
       * ```
       */
      function database(options?: { env?: string }): Database;
    }
  }
}

