// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function fetcher(url: string): Promise<any> {
  return fetch(url).then((res) => res.json());
}
