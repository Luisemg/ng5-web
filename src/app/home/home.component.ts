import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger} from '@angular/animations';
import { DataService } from '../data.service';
import { GraphqlProductsService} from '../graphql.products.service';
import { Subscription } from 'rxjs';
import { GraphqlUsersService} from '../graphql.users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('goals',[
      transition('* =>*',[
        query(':enter',style({ opacity: 0  }), {optional: true}),
        query(':enter', stagger('300ms',[
          animate('.6s ease-in',keyframes([
            style({opacity: 0, transform:'translateY(-75%)', offset:0 }),
            style({opacity: .5, transform:'translateY(35px)', offset:.3 }),
            style({opacity: 1, transform:'translateY(0)', offset:1 }),
          ]))
        ]), {optional: true}),
        
        query(':leave', stagger('300ms',[
          animate('.6s ease-in',keyframes([
            style({opacity: 1, transform:'translateY(0)', offset:0 }),
            style({opacity: .5, transform:'translateY(35px)', offset:.3 }),
            style({opacity: 0 , transform:'translateY(-75%)', offset:1 }),
          ]))
        ]), {optional: true}) 


      ]) 
    ])
  ]
})

export class HomeComponent implements OnInit {

  itemCount: number = 0;
  btnText: string = "Add an item";
  goalText: string = "";
  user: string = "";
  pass: string = "";
  token: string = "";

  goals: Array<any> = [];

  loading: boolean = false;
  private querySubscription: Subscription = new Subscription();  


  constructor(private _data: DataService,
              private graphqlProductsService: GraphqlProductsService,
              private graphqlUsersService : GraphqlUsersService) { }

  //Life-cycle hook which is initiated when the app loads.
  //cuando el componente se carga, se ejecuta esto:
  ngOnInit() {
    //this._data.goal.subscribe(res => this.goals = res);
    this.itemCount = this.goals.length;
    //this._data.changeGoal(this.goals);

    this.querySubscription = this.graphqlProductsService.links("-")
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.goals = JSON.parse(JSON.stringify(data)).links;
        console.log(JSON.stringify(this.goals))
      });    
  }

  loginUser() {

    alert(this.user + " - " + this.pass);
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
      // this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      //this.storageService.setLocal("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
      

      //this.loginService.showData(mydata);
      // this.router.navigate(['/']);

    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
  } 

  addItem(){
    //this.goals.push(this.goalText);

    // var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiZXhwIjoxNjM1Mzc3NTQ1LCJvcmlnSWF0IjoxNjM1Mzc3MjQ1fQ._51yfCRUn1hHc554zyGGYJSJ_7v46jS_YJN6Mb063VQ";
    var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Ikx1aXNFbnJpcXVlIiwiZXhwIjoxNjM1OTczMjg4LCJvcmlnSWF0IjoxNjM1OTcyOTg4fQ.xH60Er5gpV6OC3ifeiUb4h6S0HxgHWoZ8HrQtJYB9vg";
    //this.storageService.getSession("token");
    alert(this.goalText);

    this.graphqlProductsService.createLink(mytoken, "https://www.github.com", this.goalText)
    .subscribe(({ data }) => {
       console.log('link created :  ', data);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });

    this.goalText = '';
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);
  }

  removeItem(i: any){
    this.goals.splice(i, 1);
    this._data.changeGoal(this.goals);
  }
}