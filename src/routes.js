const { addExpense, getAllExpense, summaryExpense, updateExpense } = require("./expense");

const routes = [
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
    }
];

module.exports = routes;   
