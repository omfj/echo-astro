import fs from "node:fs/promises";
import { existsSync, writeFile } from "node:fs";
import path from "node:path";

export class Kv<T> {
  #filename: string;

  constructor(filename: string, initialValue: Record<string, T> = {}) {
    this.#filename = filename;

    if (!existsSync(this.getPath())) {
      writeFile(this.getPath(), JSON.stringify(initialValue), () => {});
    }
  }

  async get(key: string): Promise<T | null> {
    const kv = await this.getKv();
    return kv[key] ?? null;
  }

  async set(key: string, value: T): Promise<void> {
    const kv = await this.getKv();
    kv[key] = value;
    await this.flush(kv);
  }

  async delete(key: string): Promise<void> {
    const kv = await this.getKv();
    delete kv[key];
    await this.flush(kv);
  }

  async has(key: string): Promise<boolean> {
    const kv = await this.getKv();
    return key in kv;
  }

  private getPath() {
    return path.join(process.cwd(), this.#filename);
  }

  private async getKv() {
    const file = await fs.readFile(this.getPath(), "utf-8");
    return JSON.parse(file) as Record<string, T>;
  }

  private async flush(kv: Record<string, T>) {
    await fs.writeFile(this.getPath(), JSON.stringify(kv));
  }
}
