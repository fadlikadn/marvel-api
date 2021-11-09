"use strict";

class AppError {
    error: boolean;
    errorMessage: string | undefined;
    redirect: boolean;
    /**
     * 
     * @param _errorMessage 
     */
    constructor(_errorMessage = undefined) {
        this.error = true;
        this.errorMessage = _errorMessage;
        this.redirect = false;
    }
}

export default AppError;