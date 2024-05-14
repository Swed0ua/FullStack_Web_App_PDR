const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const isValidPassword = (password) => {
    return password.length >= 8 && password.length <= 24;
};

module.exports = {
    isValidEmail,
    isValidPassword
};