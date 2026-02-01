import connectToDatabase from '../_db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('students');
    const { id } = req.query;

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Missing id' });

      // try delete by ObjectId, fall back to studentId
      let result;
      try {
        result = await collection.deleteOne({ _id: new ObjectId(id) });
      } catch (e) {
        result = await collection.deleteOne({ studentId: id });
      }

      if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API /api/students/[id] error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
