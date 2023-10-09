const setLocalStorage = (key, storage) =>
  (localStorage[key] = JSON.stringify(storage));

export function getLocalStorage(key) {
  let suggests;
  try {
    suggests = JSON.parse(localStorage[key]);
  } catch (e) {
    suggests = [];
  }
  return suggests;
}

export function addToLocalStorage(key, query) {
  const storage = getLocalStorage(key);

  const idx = storage.map((_query) => _query.text).indexOf(query.text);

  if (idx !== -1) {
    storage.splice(idx, 1);
  }

  storage.unshift(query);
  if (storage.length > 10) storage.pop();
  setLocalStorage(key, storage);
}
