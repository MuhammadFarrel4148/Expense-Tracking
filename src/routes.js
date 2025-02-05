const { addExpense, getAllExpense, summaryExpense, updateExpense, deleteExpense, registerAccount, loginAccount, forgotPassword, inputOtp, logoutAccount } = require("./expense");

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: registerAccount,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginAccount,
    },
    {
        method: 'POST',
        path: '/forgotpassword',
        handler: forgotPassword,
    },
    {
        method: 'POST',
        path: '/inputotp',
        handler: inputOtp,
    },
    {
        method: 'POST',
        path: '/logout',
        handler: logoutAccount,
    },
    {
       method: 'POST',
       path: '/expense',
       handler: addExpense,
    },
    {
        method: 'GET',
        path: '/expense',
        handler: getAllExpense,
    },
    {
        method: 'GET',
        path: '/expense/summary',
        handler: summaryExpense,
    },
    {
        method: 'PUT',
        path: '/expense/{id}',
        handler: updateExpense
    },
    {
        method: 'DELETE',
        path: '/expense/{id}',
        handler: deleteExpense,
    },
];

module.exports = routes;   
