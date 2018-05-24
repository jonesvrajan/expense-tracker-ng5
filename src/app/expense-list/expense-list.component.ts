import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../class/expense';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  expenses: any;
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  private dbPath = '/expenses';
  searchterm: string;
 
  startAt = new Subject();
  endAt = new Subject();
 
  allexpenses;
 
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  
  constructor(private expenseService: ExpenseService, private afs: AngularFirestore) { 
    
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
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((expenses) => {
        this.expenses = expenses;
      })
    })
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

  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.expenses = this.allexpenses;
    }
  }
 
  firequery(start, end) {
    return this.afs.collection('expenses', ref => ref.limit(4).orderBy('description').startAt(start).endAt(end)).valueChanges();
  }
 
  getallexpenses() {
    return this.afs.collection('expenses', ref => ref.orderBy('description')).valueChanges();
  }

}
