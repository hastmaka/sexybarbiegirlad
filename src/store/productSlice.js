import {createSlice} from '@reduxjs/toolkit';
import {create, getAll} from "../helper/FirestoreApi";

const productSlice = createSlice({
    name: 'admin',
    initialState: {
        product: [],
        tempProduct: {},

        //states
        image: [],
        progress: 0,

        productState: {loaded: false, loading: false},
    },
    reducers: {
        setImage(state, {payload}){state.image = [...payload]},
        setProgress(state, {payload}){state.progress = payload},
        setTempProduct(state, {payload}){state.tempProduct = {...payload}},
        updateProduct(state, {payload}) {
            const product = [...state.product];
            const indexToUpdate = product.findIndex(item => item.id === payload.id);
            product[indexToUpdate] = payload;
            state.product = product;
        }
    },
    extraReducers: (builder) => {
        //getAll
        builder.addCase(getAll.pending, (state, {meta}) => {
            switch (meta.arg.collection) {
                case 'products':
                    state.productState.loading = true;
                    break;
                default:
                    return
            }
        });
        builder.addCase(getAll.fulfilled, (state, {meta, payload}) => {
            switch (meta.arg.collection) {
                case 'products':
                    state.product = payload;
                    state.productState.loading = false;
                    state.productState.loaded = true;
                    break;
                default:
                    return
            }
        });
        builder.addCase(getAll.rejected, (state, {meta}) => {
            debugger
            state.message = meta.type;
        });
        //create
        builder.addCase(create.pending, (state, {meta}) => {
            switch (meta.arg.collection) {
                case 'products':
                    state.productState.loading = true;
                    break;
                default:
                    return
            }
        });
        builder.addCase(create.fulfilled, (state, {meta, payload}) => {
            switch (meta.arg.collection) {
                case 'products':
                    state.product = [...state.product, {...meta.arg.data, id: payload}];
                    state.productState.loading = false;
                    state.productState.loaded = true;
                    break;
                default:
                    return
            }
        });
        builder.addCase(create.rejected, (state, {meta}) => {
            debugger
            state.message = meta.type;
        });
    },
});

export const productSliceActions = productSlice.actions;
export default productSlice.reducer;