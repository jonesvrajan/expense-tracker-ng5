import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Expense } from '../class/expense';
import { QueryFn } from 'angularfire2/database/interfaces';
import {FirebaseListObservable } from "angularfire2/database-deprecated";
 
@Injectable()
export class ExpenseService {
 
  private dbPath = '/expenses';
 
  expensesRef: AngularFireList<Expense> = null;
 
  constructor(private db: AngularFireDatabase) {
    this.expensesRef = db.list(this.dbPath);
  }
  
 
  createExpense(expense: Expense): void {
    this.expensesRef.push(expense);
  }
 
  updateExpense(key: string, value: any): void {
    this.expensesRef.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteExpense(key: string): void {
    this.expensesRef.remove(key).catch(error => this.handleError(error));
  }
 
  getExpensesList(): AngularFireList<Expense> {
    return this.expensesRef;
  }
 
  deleteAll(): void {
    this.expensesRef.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }
}
