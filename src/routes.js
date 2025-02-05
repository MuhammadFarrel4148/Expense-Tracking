const { addExpense, getAllExpense, summaryExpense, updateExpense, deleteExpense, registerAccount, loginAccount, forgotPassword, inputOtp, logoutAccount, AccessValidation, automationOTP } = require("./expense");

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
        method: 'GET',
        path: '/automation/{email}',
        handler: automationOTP,
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
        pre: [{ method: AccessValidation }]
       }
    },
    {
        method: 'GET',
        path: '/expense',
        handler: getAllExpense,
        options: {
            pre: [{ method: AccessValidation }]
        }
    },
    {
        method: 'GET',
        path: '/expense/summary',
        handler: summaryExpense,
        options: {
            pre: [{ method: AccessValidation }]
        }
    },
    {
        method: 'PUT',
        path: '/expense/{id}',
        handler: updateExpense,
        options: {
            pre: [{ method: AccessValidation }]
        }
    },
    {
        method: 'DELETE',
        path: '/expense/{id}',
        handler: deleteExpense,
        options: {
            pre: [{ method: AccessValidation }]
        }
    },
];

module.exports = routes;   
