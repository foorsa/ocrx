// Step Types

// These Steps are used to track the progress of the user through the application.

/* The Steps are:
    Upload: The user is uploading a file
    Correct: The user is correcting and translating the file
    Finish: The user is validating the file to be downloaded
*/

// Types:

// The Steps enum is used to define the possible values for the Step property of the IState interface.

export enum Steps {
    Upload = "Upload",
    Correct = "Correct",
    Finish = "Finish"
}