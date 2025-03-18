import { RoleItem } from '@/services/roles/rolesServices';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: RoleItem = {
    id: '',
    name: '',
    appName: '',
    displayRole: {
        isRead: false,
        isCreate: false,
        isUpdate: false,
        isDelete: false,
        isExport: false,
        isImport: false,
        isUpload: false,
        isConfirm: false,
        isApprove: false,
        isReject: false,
    },
    isActived: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppData: (state, action: PayloadAction<RoleItem>) => {
            return { ...state, ...action.payload };
        },
        resetAppData: () => initialState,
    },
});

export const { setAppData, resetAppData } = appSlice.actions;
export default appSlice.reducer;
