import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public todos = [];
  public filter = 'All';
  id: number;
  name: string;
  status: string;

  constructor(public navCtrl: NavController, private nativeStorage: NativeStorage) {
    
  }

  ionViewWillEnter() {
    this.nativeStorage.keys()
    .then(
      (keys) => {
        for(let key of keys) {
          this.nativeStorage.getItem(key)
          .then(
            data => this.todos.push(data),
            error => console.error(error)
          );
        }
      },
      (err) => console.log(err)
    );
  }

  createTodo() {
    let newTodo = {
      id: Date.now() + 1,
      name: this.name,
      status: 'Pending'
    }
    this.nativeStorage.setItem(newTodo.id.toString(), newTodo);
    this.todos.push(newTodo);
  }

  clearTodos() {
    this.nativeStorage.clear();
    this.todos = [];
  }

  changeTodo(option, id) {
    if(option === 'Delete') {
      if (confirm('Are you sure you want to delete this todo?')) {
        let removeItem = this.todos.findIndex(i => i.id == id);
        this.todos.splice(removeItem, 1);
        this.nativeStorage.remove(id);
      } else {
        return;
      }
    } else if (option === 'Edit') {
      let updateTodo = {
        id: null,
        name: null,
        status: null
      };
      
      let updatedName = prompt('What is the updated todo?');
      if (updatedName === null) {
        return;
      }
      let editIndex = this.todos.findIndex(i => i.id == id);
      this.todos[editIndex].name = updatedName;
      
      updateTodo.name = updatedName;

      this.nativeStorage.getItem(id)
      .then(
        data => {
          updateTodo.id = data.id;
          updateTodo.status = data.status;
          this.nativeStorage.setItem(id, updateTodo);
        },
        err => console.error(err)
      );
    }
    return;
  }

  statusChange(newData, id) {
    let updateTodo = {
      id: null,
      name: null,
      status: null
    };
    this.nativeStorage.getItem(id)
    .then(
      data => {
        updateTodo.id = data.id;
        updateTodo.name = data.name;
        updateTodo.status = newData;
        this.nativeStorage.setItem(id, updateTodo);
      },
      err => console.error(err)
    );
  }
}
