import chalk from "chalk";

export class ApiError extends Error {
  code: number;
  message!: string;
  details: {};

  constructor(code: number, message: string, details = {}) {
    super(message);
    this.name = "CustomError";
    this.code = code;
    this.details = details;
  }

  public override toString() {
    const stringified = JSON.stringify(
      { status: this.code, message: this.message, details: this.details },
      null,
      2
    );
    return chalk.red(`[ERROR] : ${stringified}`);
  }
}
