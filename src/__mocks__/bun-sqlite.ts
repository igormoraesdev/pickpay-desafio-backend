import BetterSqlite3 from 'better-sqlite3';

class WrappedStatement {
  private stmt: BetterSqlite3.Statement;

  constructor(stmt: BetterSqlite3.Statement) {
    this.stmt = stmt;
  }

  run(...params: any[]) {
    return this.stmt.run(...params);
  }

  get(...params: any[]) {
    return this.stmt.get(...params);
  }

  all(...params: any[]) {
    return this.stmt.all(...params);
  }

  values(...params: any[]) {
    const rows = this.stmt.raw(true).all(...params);
    return rows;
  }

  finalize() {}
}

export class Database {
  private db: BetterSqlite3.Database;

  constructor(path?: string) {
    this.db = new BetterSqlite3(path || ':memory:');
  }

  prepare(sql: string) {
    return new WrappedStatement(this.db.prepare(sql));
  }

  exec(sql: string) {
    return this.db.exec(sql);
  }

  close() {
    return this.db.close();
  }
}
