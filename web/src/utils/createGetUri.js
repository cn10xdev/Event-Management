export default function createGetUri(url, params) {
  const paramsString = params.map(([key, val]) => key + '=' + val).join('&');
  return url + '?' + paramsString;
}
