import connectToDatabase from '../_db.js';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('students');

    if (req.method === 'GET') {
      const students = await collection.find({}).toArray();
      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const body = req.body;
      if (!body) return res.status(400).json({ error: 'Missing body' });

      // Upsert by studentId if provided, otherwise insert
      const filter = body.studentId ? { studentId: body.studentId } : {};
      await collection.updateOne(filter, { $set: body }, { upsert: true });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/students error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
