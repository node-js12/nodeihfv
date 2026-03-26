const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString:
        'Driver={ODBC Driver 18 for SQL Server};' +
        'Server=localhost\\SQLEXPRESS02;' +
        'Database=PizzaHouseDB;' +
        'Trusted_Connection=Yes;' +
        'TrustServerCertificate=Yes;'
};

let pool;

async function getPool() {
    if (pool) return pool;
    pool = await sql.connect(config);
    return pool;
}

module.exports = {
    sql,
    getPool
};