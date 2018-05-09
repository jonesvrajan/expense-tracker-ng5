import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../class/expense';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  expenses: any;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    this.getExpensesList();
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
