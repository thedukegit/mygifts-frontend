/**
 * Simple logging utility for migration progress
 */

export class Logger {
  private indent = 0;

  info(message: string): void {
    console.log('  '.repeat(this.indent) + '→ ' + message);
  }

  success(message: string): void {
    console.log('  '.repeat(this.indent) + '✓ ' + message);
  }

  error(message: string, error?: unknown): void {
    console.error('  '.repeat(this.indent) + '✗ ' + message);
    if (error) {
      console.error('  '.repeat(this.indent + 1), error);
    }
  }

  warn(message: string): void {
    console.warn('  '.repeat(this.indent) + '⚠ ' + message);
  }

  section(title: string): void {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
  }

  increaseIndent(): void {
    this.indent++;
  }

  decreaseIndent(): void {
    this.indent = Math.max(0, this.indent - 1);
  }

  progress(current: number, total: number, item: string): void {
    const percentage = Math.round((current / total) * 100);
    console.log(`  [${current}/${total}] ${percentage}% - ${item}`);
  }
}

export const logger = new Logger();

