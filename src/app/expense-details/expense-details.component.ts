import { Component, OnInit, Input } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../class/expense';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent implements OnInit {

  @Input() expense: Expense;

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
  }

  updateActive(isActive: boolean) {
    this.expenseService.updateExpense(this.expense.key, { active: isActive });
  }

  deleteExpense() {
    this.expenseService.deleteExpense(this.expense.key);
  }

}
