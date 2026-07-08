import { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Users } from 'lucide-react';
import './EmployeeSidebar.css';

export default function EmployeeSidebar({
  employees,
  editingEmp,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onAdd,
  onDelete,
}) {
  const [newName, setNewName] = useState('');
  const [editName, setEditName] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingEmp && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingEmp]);

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter' && editingEmp) {
      onSaveEdit(editingEmp, editName);
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const startEdit = (emp) => {
    setEditName(emp.name);
    onStartEdit(emp.id);
  };

  return (
    <aside className="sidebar" aria-label="Gestione dipendenti">
      <div className="sidebar-header">
        <Users size={18} strokeWidth={2} aria-hidden="true" />
        <h2 className="sidebar-heading">Dipendenti</h2>
        <span className="sidebar-count">{employees.length}</span>
      </div>

      <div className="sidebar-add">
        <label htmlFor="new-employee-name" className="sr-only">Nome nuovo dipendente</label>
        <input
          ref={inputRef}
          id="new-employee-name"
          type="text"
          className="input sidebar-input"
          placeholder="Nome dipendente…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={60}
        />
        <button
          className="btn btn-primary btn-icon"
          onClick={handleAdd}
          disabled={!newName.trim()}
          aria-label="Aggiungi dipendente"
          title="Aggiungi dipendente"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      <ul className="sidebar-list" role="list">
        {employees.length === 0 && (
          <li className="sidebar-empty">
            <p>Nessun dipendente. Aggiungine uno per iniziare.</p>
          </li>
        )}
        {employees.map((emp) => (
          <li key={emp.id} className="sidebar-item">
            {editingEmp === emp.id ? (
              <div className="sidebar-edit-row">
                <label htmlFor={`edit-emp-${emp.id}`} className="sr-only">Modifica nome dipendente</label>
                <input
                  ref={editInputRef}
                  id={`edit-emp-${emp.id}`}
                  type="text"
                  className="input sidebar-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  maxLength={60}
                />
                <button
                  className="btn btn-icon btn-success"
                  onClick={() => onSaveEdit(emp.id, editName)}
                  disabled={!editName.trim()}
                  aria-label="Conferma modifica"
                  title="Conferma"
                >
                  <Check size={16} strokeWidth={2} />
                </button>
                <button
                  className="btn btn-icon btn-ghost"
                  onClick={onCancelEdit}
                  aria-label="Annulla modifica"
                  title="Annulla"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div className="sidebar-item-row">
                <span className="sidebar-name">{emp.name}</span>
                <div className="sidebar-actions">
                  <button
                    className="btn btn-icon btn-ghost-sm"
                    onClick={() => startEdit(emp)}
                    aria-label={`Modifica ${emp.name}`}
                    title="Modifica"
                  >
                    <Pencil size={14} strokeWidth={2} />
                  </button>
                  <button
                    className="btn btn-icon btn-ghost-sm btn-danger"
                    onClick={() => onDelete(emp.id)}
                    aria-label={`Elimina ${emp.name}`}
                    title="Elimina"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
