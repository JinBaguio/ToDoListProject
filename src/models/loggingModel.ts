export class LoggingModel {
    ActionId: number
    ActionDetails: string
    UserId: string
 
     constructor(ActionId: number, ActionDetails: string, UserId: string){
         this.ActionId = ActionId;
         this.ActionDetails = ActionDetails;
         this.UserId = UserId;
     }
 }