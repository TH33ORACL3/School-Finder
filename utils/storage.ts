const BOOKMARKS_KEY = 'school_finder_bookmarks';

export const loadBookmarks = (): Set<string> => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (error) {
    console.error('Failed to load bookmarks:', error);
    return new Set();
  }
};

export const saveBookmarks = (bookmarks: Set<string>): void => {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

export const addBookmark = (schoolId: string): Set<string> => {
  const bookmarks = loadBookmarks();
  bookmarks.add(schoolId);
  saveBookmarks(bookmarks);
  return bookmarks;
};

export const removeBookmark = (schoolId: string): Set<string> => {
  const bookmarks = loadBookmarks();
  bookmarks.delete(schoolId);
  saveBookmarks(bookmarks);
  return bookmarks;
};

export const toggleBookmark = (schoolId: string): Set<string> => {
  const bookmarks = loadBookmarks();
  if (bookmarks.has(schoolId)) {
    bookmarks.delete(schoolId);
  } else {
    bookmarks.add(schoolId);
  }
  saveBookmarks(bookmarks);
  return bookmarks;
};
