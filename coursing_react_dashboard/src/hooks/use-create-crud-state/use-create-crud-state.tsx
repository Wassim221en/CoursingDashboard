import { useCallback, useState } from 'react';

enum ActionTypes {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

function useCreateCrudState<T>() {
  type CrudState =
    | {
        actionType: 'ADD' | '';
        actionId?: never;
        selectedData?: never;
      }
    | {
        actionType: 'DELETE';
        actionId?: number | never;
        selectedData?: T;
      }
    | {
        actionType: 'EDIT';
        actionId?: number | never;
        selectedData?: T;
      };

  const [crudState, setCrudState] = useState<CrudState>({ actionType: '' });

  const dispatchAdding = useCallback(
    () => setCrudState({ actionType: ActionTypes.ADD }),
    [],
  );

  const dispatchEditing = useCallback(
    (editingObject: { selectedData: T } | { actionId: number }) =>
      setCrudState({
        actionType: ActionTypes.EDIT,
        ...editingObject,
      }),
    [],
  );

  const dispatchDeleting = useCallback(
    (editingObject: { selectedData: T } | { actionId: number } | number) => {
      if (typeof editingObject === 'number') {
        setCrudState({
          actionType: ActionTypes.DELETE,
          actionId: editingObject,
        });
      } else {
        setCrudState({ actionType: ActionTypes.DELETE, ...editingObject });
      }
    },
    [],
  );

  const dispatchResetCrudState = useCallback(() => {
    setCrudState({ actionType: '' });
  }, []);

  const isAdding = crudState.actionType === ActionTypes.ADD;

  const isEditing = crudState.actionType === ActionTypes.EDIT;

  const isDeleting = crudState.actionType === ActionTypes.DELETE;

  const getActionId = useCallback(() => crudState.actionId ?? 0, [crudState]);

  const getSelectedData = useCallback(
    () => crudState.selectedData ?? null,
    [crudState],
  );

  const getCurrentActionType = useCallback(
    () => crudState.actionType,
    [crudState],
  );

  return {
    isAdding,
    isEditing,
    isDeleting,
    dispatchAdding,
    dispatchEditing,
    dispatchDeleting,
    dispatchResetCrudState,
    getActionId,
    getSelectedData,
    getCurrentActionType,
  };
}

export default useCreateCrudState;
