export default function (
  func: (...rest:any[]) => Promise<any>,
  argv: any[] = process.argv
): Promise<any> {
  return func(...argv);
};
