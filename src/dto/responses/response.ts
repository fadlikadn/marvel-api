"use strict";

class Response {
    payload: any;
    metadata: any;
    error: boolean;
    errorMessage: any;

    /**
     * 
     * @param _payload 
     * @param _metadata 
     * @param _error 
     * @param _errorMessage 
     */
    constructor(_payload: any, _metadata = undefined, _error = false, _errorMessage = undefined) {
        this.payload = _payload;
        this.metadata = _metadata;
        this.error = _error;
        this.errorMessage = _errorMessage;
    }
}

export default Response;