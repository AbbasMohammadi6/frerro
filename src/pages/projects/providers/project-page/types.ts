export type State = {
  currentModal: 'newProject' | 'newCategory' | 'removeProject' | 'removeCategory' | 'moveProject' | 'editCategory' | 'editProject' | null;
};



export type Action = | {
  type: 'CHANGE_MODAL';
  payload: State['currentModal'];
};
