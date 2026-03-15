const pool = require('../config/db');
const {producer} = require('../config/kafka');

const sendAnnouncement = async(req, res)=> {
    const { title, message, target_role } = req.body;
    
    try {
        const [result] = await pool.query('INSERT INTO announcements (title, message, target_role) VALUES (?,?,?)', [title, message, target_role]);

        const announcement = {
            id: result.insertId,
            title,
            message,
            target_role,
            created_at: new Date()
        };

        await producer.send({
            topic: 'announcements',
            messages: [
                { value: JSON.stringify(announcement) }
            ]
        })

        res.status(201).json({ message: 'Announcement sent successfully', announcement });
    } catch (error) {
        console.error('Error sending announcement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAnnouncements = async(req, res)=> {
    try {
        const [rows] = await pool.query('SELECT * FROM announcements');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error getting announcements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { sendAnnouncement, getAnnouncements };