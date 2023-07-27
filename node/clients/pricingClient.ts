import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { Quote } from '../typings/externalPrice'

export default class PricingClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.myvtex.com/api/pricing`, context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: 'application/vnd.vtex.pricing.v3+json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        VtexIdclientAutcookie: context.authToken ?? '',
      },
    })
  }

  public async getPrice(
    skuId: string | number,
    priceTable: string
  ): Promise<Quote | undefined> {
    try {
      return await this.http.get<Quote>(
        `/prices/${skuId}/computed/${priceTable}`
      )
    } catch (e) {
      if (e.response.status === 404) {
        return undefined
      }

      throw e
    }
  }
}

export interface Context {
  categories: Record<string, never>
  brands: Record<string, never>
  markupRange: null
  dateRange: null
}
