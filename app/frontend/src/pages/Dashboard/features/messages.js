export const showMessage = (setMsg, text) => {
  setMsg(text);

  setTimeout(() => {
    setMsg("");
  }, 2000);
};