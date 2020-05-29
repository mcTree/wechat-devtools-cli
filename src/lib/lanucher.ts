export default function (
  func: Function,
  argv: Array<any> = process.argv
): Promise<any> {
  return func(...argv);
};
