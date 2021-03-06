import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Expense} from '../class/expense';
import {ExpenseService} from '../services/expense.service';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.scss']
})
export class NewExpenseComponent implements OnInit {

  expense: Expense = new Expense();
  submitted = false;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
  }

  fullDate: string;

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.fullDate = (`${event.value.getDate()}/${event.value.getMonth()}/${event.value.getFullYear()}`);
    
  }

  newExpense(): void {
    this.submitted = false;
    this.expense = new Expense();
  }

  save() {
    this.expense.date = this.fullDate
    this.expenseService.createExpense(this.expense);
    this.expense = new Expense();
  
  }

  onSubmit() {
    this.submitted = true;
    this.save();
  }

}
