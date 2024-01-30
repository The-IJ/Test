const generateButton = document.getElementById("generate");
const passwordInput = document.getElementById("password");
generateButton.addEventListener("click", generatePassword);
function generatePassword() {
    const length = 12; 
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    passwordInput.value = password;
}
