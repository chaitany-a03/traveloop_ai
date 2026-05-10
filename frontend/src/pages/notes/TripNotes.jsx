import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, BookOpen, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { formatDate } from '../../utils';

export default function TripNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, fetchNotes, addNote, deleteNote } = useTripStore();
  const [text, setText] = useState('');
  const [dayLabel, setDayLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchNotes(id); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      await addNote(id, { note: text.trim(), day_label: dayLabel.trim() || undefined });
      setText('');
      setDayLabel('');
      toast.success('Note saved!');
    } catch { toast.error('Failed to save note'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="page-header">Trip Journal</h1>
            <p className="text-gray-500 text-sm">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Editor */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4 text-primary-600">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold text-gray-800">Write a note</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input-field text-sm" placeholder="Day label (e.g. Day 1, Arrival...)"
              value={dayLabel} onChange={e => setDayLabel(e.target.value)} />
            <textarea
              className="input-field resize-none text-sm"
              rows={5}
              placeholder="Write your thoughts, memories, or plans here..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting || !text.trim()} className="btn-primary text-sm">
                {isSubmitting ? '...' : <><Plus className="w-4 h-4" /> Save Note</>}
              </button>
            </div>
          </form>
        </div>

        {/* Notes list */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No notes yet. Start journaling your adventure!</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="card p-5 group hover:shadow-soft transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    {note.day_label && (
                      <span className="badge-primary mb-2 inline-flex">{note.day_label}</span>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(note.created_at, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button onClick={() => { deleteNote(id, note.id); toast.success('Note deleted'); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{note.note}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
