export function createHandleChange(setState, setErrorsState = () => {}) {
  return event => {
    if (setErrorsState) {
      setErrorsState(state => ({
        ...state,
        [event.target.name]: null,
      }));
    }
    setState(state => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };
}
