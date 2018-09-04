// Main script file that loads first, contains dom manipulation for login, signup and loading main.js (game script file)

// Handles signuptab button to show signup form and hide login form
document.querySelector("#signupTab").addEventListener("click", () => {

    let loginForm = document.querySelector("#loginForm");
    let signupForm = document.querySelector("#signupForm");

    loginForm.classList.add("hide");
    signupForm.classList.remove("hide");
});

// Handles logintab button to show login form and hide signup form
document.querySelector("#loginTab").addEventListener("click", () => {

    let loginForm = document.querySelector("#loginForm");
    let signupForm = document.querySelector("#signupForm");

    loginForm.classList.remove("hide");
    signupForm.classList.add("hide");
});

// Handles login button. Will run function loginSubmit
document.querySelector("#submitLogin").addEventListener("click", (event) => {
    event.preventDefault();
    loginSubmit();
});

/*  Will as of now only load the game script file. Backend implementation needed to 
    authenticate user
*/
function loginSubmit() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;   

    /* Pseudocode - Check input to database user here */
    // If true load the game from fetch

    let loginForm = document.querySelector("#login");
    loginForm.classList.add("hide");

    dynamicScriptLoad("main.js");

}

// Load main.js only after login click event
function dynamicScriptLoad(url) {
    const script = document.createElement("script"); //Make a script DOM node
    script.src = url; //Set it's src to the provided URL
    document.body.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

