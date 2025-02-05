const { addExpense, getAllExpense, summaryExpense, updateExpense, deleteExpense, registerAccount, loginAccount, forgotPassword, inputOtp, logoutAccount, AccessValidation } = require("./expense");

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
       options: {
        pre: [{ AccessValidation }]
       }
    },
    {
        method: 'GET',
        path: '/expense',
        handler: getAllExpense,
        options: {
            pre: [{ AccessValidation }]
        }
    },
    {
        method: 'GET',
        path: '/expense/summary',
        handler: summaryExpense,
        options: {
            pre: [{ AccessValidation }]
        }
    },
    {
        method: 'PUT',
        path: '/expense/{id}',
        handler: updateExpense,
        options: {
            pre: [{ AccessValidation }]
        }
    },
    {
        method: 'DELETE',
        path: '/expense/{id}',
        handler: deleteExpense,
        options: {
            pre: [{ AccessValidation }]
        }
    },
];

module.exports = routes;   
