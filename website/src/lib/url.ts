/**
 * Builds a link that works under the site's base path
 * (for example /Personal-Profile-Portfolio/ on GitHub Pages).
 */
export function url(path = ""): string {
  const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return base + path.replace(/^\/+/, "");
}

/** The current path with the base removed, always starting and ending with "/". */
export function routeOf(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  let path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  if (!path.startsWith("/")) path = `/${path}`;
  return path.endsWith("/") ? path : `${path}/`;
}
