import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertIncomingResponseFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setAbstractRuntimeString,
  setCrypto,
} from '../../runtime';

import {
  nextFetch,
  nextConvertRequest,
  nextConvertIncomingResponse,
  nextConvertAndSendResponse,
  nextConvertAndSetHeaders,
  nextRuntimeString,
} from './adapter';

setAbstractFetchFunc(nextFetch);
setAbstractConvertRequestFunc(nextConvertRequest);
setAbstractConvertIncomingResponseFunc(nextConvertIncomingResponse);
setAbstractConvertResponseFunc(nextConvertAndSendResponse);
setAbstractConvertHeadersFunc(nextConvertAndSetHeaders);
setAbstractRuntimeString(nextRuntimeString);
setCrypto(crypto as any);
