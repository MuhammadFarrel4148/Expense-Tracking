const db = require("./db");
const { nanoid } = require('nanoid')

const addExpense = async(request, h) => {
    const { deskripsi, nominal, date } = request.payload;

    try {
        if(!deskripsi || !nominal || !date) {
            const response = h.response({
                status: 'fail',
                message: 'Data tidak boleh kosong',
            });
            response.code(400);
            return response;
        };
    
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
    
        const [expense] = await db.query(`INSERT INTO expense(id, deskripsi, nominal, date, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?)`, [id, deskripsi, nominal, date, createdAt, updatedAt]);

        if(expense.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                messsage: 'expense berhasil dibuat',
                data: {
                    id: id,
                    deskripsi: deskripsi,
                    nominal: nominal,
                    date: date,
                }
            });
            response.code(200);
            return response;
        };

        const response = h.response({
            status: 'fail',
            message: 'expense gagal dibuat',
        });
        response.code(400);
        return response;
    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid add expense',
        })
        response.code(400);
        return response;
    };
};

const getAllExpense = async(request, h) => {
    const { deskripsi, nominal, date } = request.query;

    try {
        let sqlQuery = `SELECT deskripsi, nominal, date FROM expense WHERE 1=1`;
        let sqlParams = []; 

        if(deskripsi !== undefined) {
            sqlQuery += ` AND deskripsi LIKE ?`;
            sqlParams.push(`%${deskripsi}%`);
        };

        if(nominal !== undefined) {
            sqlQuery += ` AND nominal = ?`;
            sqlParams.push(nominal);
        };

        if(date !== undefined) {
            sqlQuery += ` AND date = ?`;
            sqlParams.push(date);
        };

        const [expense] = await db.query(sqlQuery, sqlParams);

        if(expense.length > 0) {
            const response = h.response({
                status: 'success',
                message: 'expense ditemukan',
                data: {
                    expense,
                }
            });
            response.code(200);
            return response;
        };

        const response = h.response({
            status: 'fail',
            message: 'expense not found',
        });
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid get expense',
        });
        response.code(400);
        return response;
    };
};

const summaryExpense = async(request, h) => {
    try{
        const [ expenses ] = await db.query(`SELECT * FROM expense`);

        let no_eat = 0;
        let no_shopping = 0;
        let no_needs = 0;
    
        expenses.forEach(expense => {
            if(typeof expense.nominal === 'number') {
                switch(expense.deskripsi) {
                    case 'eat':
                        no_eat += expense.nominal;
                        break;
                    case 'shopping':
                        no_shopping += expense.nominal;
                        break;
                    case 'needs':
                        no_needs += expense.nominal;
                        break;
                }
            }
        });
    
        const result = {
            expense_eat: no_eat,
            expense_shopping: no_shopping,
            expense_needs: no_needs
        };
    
        const response = h.response({
            status: 'success',
            result: result,
        });
        response.code(200);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid get summary expense',
        })
        response.code(400);
        return response;
    };
};

const updateExpense = async(request, h) => {
    const { id } = request.params;

    try {
        const [expense] = await db.query(`SELECT * FROM expense WHERE id = ?`, [id]);

        if(expense.length === 1) {
            const { deskripsi = expense[0].deskripsi, nominal = expense[0].nominal, date = expense[0].date } = request.payload || {};

            if(deskripsi !== 'eat' && deskripsi !== 'shopping' && deskripsi !== 'needs') {
                const response = h.response({
                    status: 'fail',
                    message: 'Deskripsi tidak valid',
                })
                response.code(400);
                return response;
            }

            const updatedAt = new Date().toISOString();
    
            const [result] = await db.query(`UPDATE expense SET deskripsi = ?, nominal = ?, date = ?, updatedAt = ? WHERE id = ?`, [deskripsi, nominal, date, updatedAt, id]);
    
            if(result.affectedRows === 1) {
                const response = h.response({
                    status: 'success',
                    message: 'expense berhasil diupdate',
                    data: {
                        deskripsi: deskripsi,
                        nominal: nominal,
                        date: date,
                    }
                })
                response.code(200);
                return response;
            }
    
            const response = h.response({
                status: 'fail',
                message: 'expense gagal diupdate',
            })
            response.code(400);
            return response;
        };
    
        const response = h.response({
            status: 'fail',
            message: 'expense tidak ditemukan',
        })
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid update expense'
        })
        response.code(400);
        return response;
    };
}

module.exports = { addExpense, getAllExpense, summaryExpense, updateExpense }
