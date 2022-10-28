export default function fetcher(url: string): Promise<any> {
  return fetch(url).then((res) => res.json());
}
