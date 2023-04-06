import type {IncomingMessage, ServerResponse} from 'http';

import fetch from 'node-fetch';

import {
  AdapterArgs,
  canonicalizeHeaders,
  flatHeaders,
  Headers,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';

interface NextAdapterArgs extends AdapterArgs {
  rawRequest: IncomingMessage; // This is probably what we need to start with, it should be NextRequest + NextResponse?
  rawResponse: ServerResponse;
}

export async function nextConvertRequest(
  adapterArgs: NextAdapterArgs,
): Promise<NormalizedRequest> {
  const req = adapterArgs.rawRequest;

  return {
    headers: canonicalizeHeaders({...req.headers} as any),
    method: req.method ?? 'GET',
    // Express.js overrides the url property, so we want to use originalUrl for it
    url: (req as any).originalUrl || req.url!,
  };
}

export async function nextConvertIncomingResponse(
  adapterArgs: NextAdapterArgs,
): Promise<NormalizedResponse> {
  return {
    statusCode: adapterArgs.rawResponse.statusCode,
    statusText: adapterArgs.rawResponse.statusMessage,
    headers: canonicalizeHeaders(
      adapterArgs.rawResponse.getHeaders() as any as Headers,
    ),
  } as NormalizedResponse;
}

export async function nextConvertAndSendResponse(
  response: NormalizedResponse,
  adapterArgs: NextAdapterArgs,
): Promise<void> {
  const res = adapterArgs.rawResponse;

  if (response.headers) {
    await nextConvertAndSetHeaders(response.headers, adapterArgs);
  }

  if (response.body) {
    res.write(response.body);
  }

  res.statusCode = response.statusCode;
  res.statusMessage = response.statusText;

  res.end();
}

export async function nextConvertAndSetHeaders(
  headers: Headers,
  adapterArgs: NextAdapterArgs,
): Promise<void> {
  const res = adapterArgs.rawResponse;

  Object.entries(headers).forEach(([header, value]) =>
    res.setHeader(header, value),
  );
}

export async function nextFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  const resp = await fetch(url, {method, headers: flatHeaders(headers), body});
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
  };
}

export function nextRuntimeString() {
  return `Next ${process.version}`;
}
