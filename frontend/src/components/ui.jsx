import { partitionErrors, toErrorState } from '../utils/errors';

export function Alert({ type = 'error', error, message, onClose }) {
  const state = error ?? (message ? toErrorState(message) : null);
  const { general } = partitionErrors(state);
  if (!general.length) return null;

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="alert-content">
        {general.length === 1 ? (
          <span>{general[0]}</span>
        ) : (
          <ul className="alert-list">
            {general.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        )}
      </div>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Zamknij">
          ×
        </button>
      )}
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <span className="field-error" role="alert">
      {message}
    </span>
  );
}

export function LoadingSpinner({ label = 'Ładowanie…' }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
