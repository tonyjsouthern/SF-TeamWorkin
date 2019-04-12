import { inject } from 'aurelia-framework';
import { BackendService } from './service.js';

@inject(BackendService)
export class App {

  constructor(BackendService) {
    // Injectors
    this.BackendService = BackendService;

    // UI Functions
    this.showKeyInput = true;
    this.showLoader = false;

    // Storage
    this.apiKeyl
    this.displayArray =[];
  }

  activate(){
    this.checkIfKeyExists();
    this.getStartDate(20190330)
  }

  submitController(){
    this.displayArray = []
    this.setKey();
    this.showKeyInput = false;
    this.getData();
  }

  async getData(){
    this.showLoader = false;
    var userId = await this.getUserID(this.apiKey)
    var projectArray = await this.getProjectIds(this.apiKey, userId)
    var timeStamps = await this.getTimeStamps(projectArray[1].startDate, projectArray[1].endDate, this.apiKey, projectArray[1].id)
    await this.compileData(projectArray);
    this.showLoader = true;
  }

  async compileData(projectArray){
    for (let project of projectArray) {
      let totalTime = 0
      var timeStampArray = await this.getTimeStamps(this.getStartDate(project.startDate), this.getDate(), this.apiKey, project.id)
      for (let stamp of timeStampArray) {
         totalTime = parseInt(totalTime) + parseInt(stamp.minutes) + (stamp.hours * 60)
      }
      var customerBlock = {
          name: project.name.slice(0, 20),
          time: this.minutesToHours(totalTime),
          from: this.formatDate(this.getStartDate(project.startDate)),
          to:   this.formatDate(this.getDate())
      }
      this.displayArray.push(customerBlock)
    }
  }

  // time functions
  getStartDate(startDate){
    var actualStartDate = startDate.toString();
    var date = new Date()
    var month = this.addZero(date.getMonth() + 1)
    var day = actualStartDate.slice(6,8)
    var year = date.getFullYear();
    if (day >= this.addZero(date.getDay())){
      month = this.addZero(date.getMonth())
    }
    if (month == "02" && day > "28") {
      day = "28"
    }
    return parseInt(year + month + day)
  }

  getDate(){
    var date = new Date();
    var day = this.addZero(date.getDate())
    var month = this.addZero(date.getMonth() + 1)
    var year = date.getFullYear();
    return parseInt(year + month + day)
  }

  addZero(num) {
    if (num.toString().length == 1) {
      return "0" + num;
    }else{
      return num
    }
  }

  formatDate(date){
    var string = date.toString();
    var year = string.slice(0,4)
    var month = string.slice(4, 6)
    var day = string.slice(6,8)
    return month + "-" + day + "-" + year
  }

  minutesToHours(mins) {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
}

  // API Calls
  async getUserID(key){
    var data = await this.BackendService.getUserID(key)
    return data.data.account.userId
  }

  async getProjectIds(id, key){
    var data = await this.BackendService.getProjectIds(id, key);
    return data.data.projects;
  }

  async getTimeStamps(fromDate, endDate, key, id){
    var data = await this.BackendService.getTimeStamps(fromDate, endDate, key, id);
    return data.data['time-entries']
  }

  // Manage Key Functions and local storage
  setKey(){
    localStorage.setItem('apiKey', this.apiKey)
  }

  clearKey(){
    localStorage.clear()
    this.showKeyInput = true;
  }

  checkIfKeyExists(){
    var storedKey = localStorage.getItem('apiKey')
    if (storedKey == null){
      }else{
        console.log(storedKey)
        this.apiKey = storedKey;
        this.showKeyInput = false;
        this.getData();
    }
  }

}
