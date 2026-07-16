import { GET } from '../../src/pages/static/[...url]'

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  const url = request.url?.split('/static/')?.[1]

  if (!url) {
    return new Response('Not Found', { status: 404 })
  }

  const target = new URL(url)
  target.searchParams.delete('path')

  const response = await GET({
    request,
    params: {
      url: target.origin + target.pathname,
    },
    url: {
      search: target.search,
    },
  })

  // 添加 Cache-Control 头，让 CDN 只缓存 60 秒
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30')

  return response
}
