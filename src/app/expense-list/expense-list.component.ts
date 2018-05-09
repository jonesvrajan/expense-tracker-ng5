import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../class/expense';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  expensesRef: AngularFireList<Expense> = null;
  expenses: any;
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  private dbPath = '/expenses';
  
  constructor(private expenseService: ExpenseService, private db: AngularFireDatabase) { 
    this.expensesRef = db.list(this.dbPath);
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(expense => expense ? this.filterStates(expense) : this.expenses.slice())
      );  
  }

  filterStates(description: string) {
    return this.expenses.filter(expense =>
      expense.description.toLowerCase().indexOf(description.toLowerCase()) === 0);
  }

  ngOnInit() {
    this.getExpensesList();
    console.log(this.expensesRef)
  }

  getExpensesList() {
    // Use snapshotChanges().map() to store the key
    this.expenseService.getExpensesList().snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }).subscribe(expenses => {
      this.expenses = expenses;
      
    });
  }

  deleteExpenses() {
    this.expenseService.deleteAll();
  }

}
