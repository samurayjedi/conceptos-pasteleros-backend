export function pathToLaravelPath(path: string) {
  return path.replace(/\[([0-9]+)\]/g, '.$1');
}
