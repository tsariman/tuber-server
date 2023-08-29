import { 
  IJsonapiResource,
  IJsonapiResourceLinkage,
  IJsonapiResponse
} from '../../../tuber-client/src/controllers/interfaces/IJsonapi'
import { IDoc, TEndpoint } from 'src/utility/common.types'

type JSONAPI_RESOURCE_TYPE = 'collection' | 'object' | 'null' | 'linkage'

export default class JsonapiResponseBuilder<T> {
  readonly JSONAPI_VERSION = '1.1'
  private skeletonResource: IJsonapiResource
  private response: IJsonapiResponse
  private readonly RESOURCE_OF_TYPE: {[key in JSONAPI_RESOURCE_TYPE]: IJsonapiResponse['data']} = {
    'collection': [] as IJsonapiResource[],
    'object': {} as IJsonapiResource,
    'null': null,
    'linkage': {} as IJsonapiResourceLinkage
  }
  private resourceType: JSONAPI_RESOURCE_TYPE
  private dataMember: T
  private alreadyBuilt: boolean

  constructor(
    data: T,
    endpoint: TEndpoint,
    type: JSONAPI_RESOURCE_TYPE = 'collection'
  ) {
    this.response = {
      jsonapi: { version: this.JSONAPI_VERSION }
    }
    this.response.data = []
    this.skeletonResource = { type: endpoint }
    this.resourceType = type
    this.dataMember = data
    this.alreadyBuilt = false
  }

  toString = () => this.response

  meta(key: string, val: any) {
    this.response.meta = this.response.meta || {}
    this.response.meta[key] = val
    return this
  }

  /** Per Jsonapi specification, the raw data must be a string. */
  private applyStringSpecification = (obj: any) => {
    Object.keys(obj).forEach(key => {
      switch (typeof obj[key]) {
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'symbol':
          obj[key] = obj[key].toString()
          break
        case 'string':
          obj[key] = obj[key].trim()
          break
        case 'object':
          if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map(
              (item: any) => this.applyStringSpecification(item)
            )
          } else {
            obj[key] = this.applyStringSpecification(obj[key])
          }
          break
      }
    })
    return obj
  }

  private getResource = (data: T & IDoc): IJsonapiResource => {
    const { _doc: {
      _id, password, __v, jwt_version, ...attributes
    } } = data
    return {
      ...this.skeletonResource,
      id: _id,
      attributes: this.applyStringSpecification(attributes)
    } as IJsonapiResource
  }

  build() {
    if (this.alreadyBuilt) {
      throw new Error('Response already built')
    }
    this.response.data = this.RESOURCE_OF_TYPE[this.resourceType]
    switch (this.resourceType) {
      case 'collection':
        this.response.data = (this.dataMember as (T & IDoc)[]).map(
          item => this.getResource(item)
        )
        break
      case 'object':
        this.response.data = this.getResource(this.dataMember as T & IDoc)
        break
      case 'linkage':
        throw new Error('Not implemented')
      case 'null':
        this.response.data = null
        break
    }
    this.alreadyBuilt = true
    return this.response
  }
}