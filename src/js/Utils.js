import KEY_CODES from './KeyCodes';

export function adjustScrollPosition(listId, elementId) {
  const listbox = document.getElementById(listId);
  const element = document.getElementById(elementId);
  
  if (element) {
    if (listbox.scrollHeight > listbox.clientHeight) {
      const scrollBottom = listbox.clientHeight + listbox.scrollTop;
      const elementBottom = element.offsetTop + element.offsetHeight;
    
      if (elementBottom > scrollBottom) {
        listbox.scrollTop = elementBottom - listbox.clientHeight;
      } else if (element.offsetTop < listbox.scrollTop) {
        listbox.scrollTop = element.offsetTop;
      }
    }
  } else {
    listbox.scrollTop = 0;
  }
}

export function handleListKeyUp(e) {
    const key = e.which || e.keyCode;

    switch (key) {
        case KEY_CODES.UP:
        case KEY_CODES.DOWN:
        case KEY_CODES.RETURN:
        case KEY_CODES.ESC:
            e.preventDefault();
            return false;
        default:
            return true;
    }
}

export function handleButtonKeyUp(e) {
    const key = e.which || e.keyCode;

    switch (key) {
        case KEY_CODES.UP:
        case KEY_CODES.DOWN:
            e.preventDefault();
            return false;
        default:
            return true;
    }
}