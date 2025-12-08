// Script to fix admin password
// Run with: node database/fix-password.js

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function fixPassword() {
    console.log('🔧 Fixing admin password...\n');

    // Generate the correct hash for 'admin123'
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);

    console.log('Generated hash for "admin123":', hash);
    console.log('\nNow updating database...\n');

    try {
        // Create connection
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Update this with your MySQL root password
            database: 'lestylist_db'
        });

        console.log('✅ Connected to database');

        // Update the password
        const [result] = await connection.execute(
            'UPDATE admin_users SET password_hash = ? WHERE username = ?',
            [hash, 'admin']
        );

        console.log('✅ Password updated successfully!');
        console.log(`   Rows affected: ${result.affectedRows}`);
        console.log('\n📝 You can now login with:');
        console.log('   Username: admin');
        console.log('   Password: admin123\n');

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 If you see "Access denied", update the MySQL password in this script');
        console.log('💡 Or run this SQL directly in phpMyAdmin:');
        console.log(`\nUPDATE admin_users SET password_hash = '${hash}' WHERE username = 'admin';\n`);
    }
}

fixPassword();
