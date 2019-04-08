export class BackendService {

  constructor(){

  }

  getUserID(key){
    return axios.get("https://api.teamwork.com/authenticate.json", {auth: {
        username: key,
        password: null
      }
    })
  }

  getProjectIds(key, id){
    return axios.get("https://salesfusion.teamwork.com/projects.json?projectOwnerIds=" + id, {auth: {
        username: key,
        password: null
      }
    })
  }

  getTimeStamps(fromDate, endDate, key, id){
  return axios.get("https://salesfusion.teamwork.com/projects/" +id + "/time_entries.json?fromdate=" + fromDate + "&todate=" + endDate, {auth: {
        username: key,
        password: null
      }
    })
  }

}
