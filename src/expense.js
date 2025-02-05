require('dotenv').config();

const db = require("./db");
const { nanoid } = require('nanoid')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const GenerateToken = (user) => {
    const token = jwt.sign({ id: user[0].id, username: user[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const AccessValidation = async(request, h) => {
    const authorization = request.headers.authorization;

    if(!authorization) {
        const response = h.response({
            status: 'fail',
            message: 'unauthorized',
        });
        response.code(400);
        return response.takeover();
    };

    const token = authorization.split(' ')[1];
    const [isBlacklist] = await db.query(`SELECT * FROM blacklisttoken WHERE token = ?`, [token]);

    if(isBlacklist.length > 0) {
        const response = h.response({
            status: 'fail',
            message: 'unauthorized',
        });
        response.code(400);
        return response.takeover();
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.auth({ credentials: decoded});
        return h.continue;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            messsage: 'Invalid access validation',
        });
        response.code(400);
        return response.takeover();
    };
};

const registerAccount = async(request, h) => {
    const { username, email, password } = request.payload;

    try {
        if(username !== undefined && email !== undefined && password !== undefined) {
            const [user] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

            if(user.length > 0) {
                const response = h.response({
                    status: 'fail',
                    message: 'email sudah digunakan, silahkan menggunakan email yang lain',
                })
                response.code(400);
                return response;
            };

            const id = nanoid(16);

            const [result] = await db.query(`INSERT INTO users(id, username, email, password) VALUES(?, ?, ?, ?)`, [id, username, email, password]);

            if(result.affectedRows === 1) {
                const response = h.response({
                    status: 'success',
                    message: 'akun berhasil dibuat',
                    data: {
                        id, username, email
                    }
                })
                response.code(200);
                return response;
            };

            const response = h.response({
                status: 'fail',
                message: 'akun gagal dibuat',
            })
            response.code(400);
            return response;
        };
    } catch {
        const response = h.response({
            status: 'fail',
            message: 'Invalid register account',
        })
        response.code(400);
        return response;
    };
};

const loginAccount = async(request, h) => {
    const { email, password } = request.payload;

    try {
        const [user] = await db.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password]);

        if(user.length === 1) {
            const token = GenerateToken(user);

            const response = h.response({
                status: 'success',
                message: 'berhasil login',
                data: {
                    username: user[0].username,
                    email: user[0].email,
                },
                token: token,
            });
            response.code(200);
            return response;
        };

        const response = h.response({
            status: 'fail',
            message: 'akun tidak ditemukan',
        });
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid login account',
        })
        response.code(400);
        return response;
    };
};

const forgotPassword = async(request, h) => {
    const { email } = request.payload;

    try {
        const [user] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

        if(user.length > 0 ) {
            const otp = nanoid(5);
            
            await db.query(`INSERT INTO codeotp(code, email) VALUES(?, ?)`, [otp, user[0].email]);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });

            await transporter.sendMail({
                from: 'Expense Tracking',
                to: user[0].email,
                subject: 'OTP Verification',
                text: `This is your verification code ${otp}. dont share with anyone`,
            });

            const response = h.response({
                status: 'success',
                message: 'kode berhasil dikirimkan, cek email anda',
            })
            response.code(200);
            return response;
        };

        const response = h.response({
            status: 'fail',
            message: 'akun tidak ditemukan',
        });
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid forgot password',
        });
        response.code(400);
        return response;
    };
};

const inputOtp = async(request, h) => {
    const { otp, newPassword } = request.payload;

    try {
        const [user] = await db.query(`SELECT * FROM codeotp WHERE code = ?`, [otp]);

        if(user.length > 0) {
            const [result] = await db.query(`UPDATE users SET password = ? WHERE email = ?`, [newPassword, user[0].email]);
            await db.query(`DELETE FROM codeotp WHERE code = ?`, otp);

            if(result.affectedRows === 1) {
                const response = h.response({
                    status: 'success',
                    message: 'password berhasil diubah',
               });
               response.code(200);
               return response; 
            };
        };

        const response = h.response({
            status: 'fail',
            message: 'code otp salah, coba lagi',
        })
        response.code(404);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid input OTP',
        })
        response.code(400);
        return response;
    };
};

const logoutAccount = async(request, h) => {
    const authorization = request.headers.authorization;

    try {
        if(!authorization) {
            const response = h.response({
                status: 'fail',
                message: 'unauthorized'
            });
            response.code(400);
            return response;
        };

        const token = authorization.split(' ')[1];
        const [isBlacklist] = await db.query(`SELECT * FROM blacklisttoken WHERE token = ?`, [token]);
        console.log(isBlacklist)

        if(isBlacklist.length > 0) {
            const response = h.response ({
                status: 'fail',
                message: 'unauthorized',
            });
            response.code(400);
            return response;
        };

        jwt.verify(token, process.env.JWT_SECRET);
        await db.query(`INSERT INTO blacklisttoken(token) VALUES(?)`, [token]);

        const response = h.response({
            status: 'fail',
            message: 'logout berhasil',
        });
        response.code(200);
        return response;

    } catch(error) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid logout account',
        });
        response.code(400);
        return response;
    };
};

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
};

const deleteExpense = async(request, h) => {
    const { id } = request.params;

    try {
        const [expense] = await db.query(`DELETE FROM expense WHERE id = ?`, [id]);

        if(expense.affectedRows === 1) {
            const response = h.response({
                status: 'success',
                message: 'expense berhasil dihapus',
            })
            response.code(200);
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
            message: 'Invalid delete expense',
        })
        response.code(400);
        return response;
    };
}

module.exports = { addExpense, getAllExpense, summaryExpense, updateExpense, deleteExpense, registerAccount, loginAccount, forgotPassword, inputOtp, logoutAccount, AccessValidation }
