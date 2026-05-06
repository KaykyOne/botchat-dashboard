import { NextRequest } from "next/server";

const DEFAULT_BOT_INTERNAL_URL = "http://localhost:3001";

function getBotBaseUrl() {
  return process.env.BOT_INTERNAL_URL ?? DEFAULT_BOT_INTERNAL_URL;
}

function buildUpstreamUrl(pathSegments: string[], search: string) {
  const normalizedPath = pathSegments.join("/");
  const baseUrl = getBotBaseUrl().replace(/\/+$/, "");
  return `${baseUrl}/${normalizedPath}${search}`;
}

function copyResponseHeaders(headers: Headers) {
  const responseHeaders = new Headers(headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-length");
  return responseHeaders;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetUrl = buildUpstreamUrl(path, request.nextUrl.search);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.delete("host");
  requestHeaders.delete("connection");
  requestHeaders.delete("content-length");

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: requestHeaders,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    redirect: "manual",
    cache: "no-store",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyResponseHeaders(upstreamResponse.headers),
  });
}

export { proxyRequest as DELETE };
export { proxyRequest as GET };
export { proxyRequest as HEAD };
export { proxyRequest as OPTIONS };
export { proxyRequest as PATCH };
export { proxyRequest as POST };
export { proxyRequest as PUT };
