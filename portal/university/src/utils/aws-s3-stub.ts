// Minimal stubs to satisfy SDK imports in the browser build

export class PutObjectCommand {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_init?: any) {}
  // mimic the middlewareStack API used by the SDK
  middlewareStack = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    add: (_handler: any, _opts?: any) => {},
  };
}

export class S3Client {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_config?: any) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async send(_command: any): Promise<any> {
    return {};
  }
}

export default {};
