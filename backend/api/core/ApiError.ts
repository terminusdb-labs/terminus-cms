export class ApiError extends Error {
    status = 400;
  
    constructor( message: string, status:number = 500) {
      super(message);
  
      this.status = status;
  
      // 👇️ because we are extending a built-in class
      Object.setPrototypeOf(this, ApiError.prototype);
    }
  
    getErrorMessage() {
      return this.message;
    }
  }