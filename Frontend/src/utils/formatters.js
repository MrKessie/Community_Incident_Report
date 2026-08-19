import { format, parseISO, formatDistanceToNow } from 'date-fns';

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch (e) {
    return dateString;
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch (e) {
    return dateString;
  }
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://127.0.0.1:8000${cleanPath}`;
}
