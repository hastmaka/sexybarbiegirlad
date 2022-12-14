import {useSelector} from "react-redux";
import {useCallback, useEffect, useMemo, useState} from "react";
// material
import {Box, Button, Stack, Tooltip, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import {DataGrid, GridActionsCellItem, GridRowModes} from "@mui/x-data-grid";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import EditIcon from '@mui/icons-material/Edit';
//
import ChildLocal from "../dashboard/childLocal/ChildLocal";
import {formatSizeArray} from "../../helper/Helper";
import VariationGrid from "./variationGrid/VariationGrid";
import EzModalWithTransition from "../../components/ezComponents/EzModalWithTransition/EzModalWithTransition";
import EzIconButton from "../../components/ezComponents/EzIconButton/EzIconButton";
import EzText from "../../components/ezComponents/EzText/EzText";
import AddProduct from "./addProduct/AddProduct";
import {updateProductApi} from "../../helper/FirestoreApi";
import EzEditToolBar from "./EzEditToolBar/EzEditToolBar";
import EzButton from "../../components/ezComponents/EzButton/EzButton";
import EzSwiper from "../../components/ezComponents/EzSwiper/EzSwiper";
import {SwiperSlide} from "swiper/react";
// import EzEditToolBar from "./EzEditToolBar/EzEditToolBar";

//----------------------------------------------------------------

const TableHeader = styled(Stack)(({theme}) => ({
    color: theme.palette.grey[0],
    padding: '0 20px',
    height: '50px',
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: '4px 4px 0 0',
    backgroundColor: theme.palette.grey[700],
    flexDirection: 'row',
    alignItems: 'center'
}));

const tableSx = {
    borderRadius: '4px',
    border: '1px solid lightgrey'
};

//----------------------------------------------------------------

export default function ProductGrid() {
    const {product, productState} = useSelector(slice => slice.admin);
    const [row, setRows] = useState([]);
    const [swiperData, setSwiperData] = useState([]);
    const [variationGridData, setVariationGridData] = useState({
        variations: [],
        productName: '',
        product: {}
    });
    const [rowModesModel, setRowModesModel] = useState({});

    //region
    // const [selectedRowParams, setSelectedRowParams] = useState(null);

    // const handleRowFocus = useCallback((event) => {
    //     const row = event.currentTarget;
    //     const id = row.dataset.id;
    //     const field = event.target.dataset.field;
    //     setSelectedRowParams({ id, field });
    // }, []);

    // const rowMode = useMemo(() => {
    //     if (!selectedRowParams) {
    //         return 'view';
    //     }
    //     const { id } = selectedRowParams;
    //     return rowModesModel[id]?.mode || 'view';
    // }, [rowModesModel, selectedRowParams]);
    //endregion

    const handleEditClick = useCallback((id) => {
        setRowModesModel({...rowModesModel,[id]: {mode: GridRowModes.Edit}})
    }, [rowModesModel]);

    const handleSaveClick = useCallback((id) => {
        setRowModesModel({...rowModesModel,[id]: {mode: GridRowModes.View}})
    }, [rowModesModel]);

    const handleCancelClick = useCallback((id) => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View, ignoreModifications: true}})
    }, [rowModesModel]);

    const handleProcessRowUpdateError = useCallback((error) => {
        window.displayNotification({type: error.type, content: error.content})
        console.log(error)
    }, []);

    const processRowUpdate = useCallback(
        async (newRow, oldRow) => {
            await new Promise((resolve, reject) => {
                //check empty field
                if(!(!!newRow.name) || !(!!newRow.category)) {
                    return reject({type: 'error', content: 'No empty field allowed'});
                } else if (newRow.price <= 0) {
                    return reject({type: 'error', content: 'Price must be greater then 0'});
                }
                debugger
                resolve()
            })
            if(JSON.stringify(newRow) === JSON.stringify(oldRow)) {
                return oldRow
            } else {
                updateProductApi(newRow.id, newRow);
                return newRow
            }
        },[]
    );

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleChangeImage = (item) => {
      debugger
    }

    const handleDeleteImage = (item) => {
      debugger
    }

    const onImageClickHandler = (images) => {
        const data = []
        images.map(item => {
            data.push({id: item.id, el:
                <SwiperSlide>
                    <Stack sx={{position: 'relative'}}>
                        <Stack
                            sx={{
                                position: 'absolute',
                                top: '7px',
                                right: '46px',
                                color: 'whitesmoke',
                                flexDirection: 'row',
                            }}
                        >
                            <EzIconButton
                                icon={<PublishedWithChangesIcon/>}
                                toolTipTitle='Change Image'
                                size='small'
                                ariaLabel='change-image'
                                onClick={_ => handleChangeImage(item)}
                            />
                            <EzIconButton
                                icon={<DeleteOutlineIcon/>}
                                toolTipTitle='Delete Image'
                                size='small'
                                ariaLabel='delete-icon'
                                onClick={_ => handleDeleteImage(item)}
                            />
                        </Stack>
                        <img src={item.url} alt={item.url} style={{width: '100%', height: '100%'}}/>
                    </Stack>
                </SwiperSlide>
            })
        })
        setSwiperData(data)
        setOpen({bool: true, who: 'swiper'})
    }

    useEffect(_ => {
        if(productState.loaded)
        setRows(product)
    }, [product, productState]);

    //modal
    const [open, setOpen] = useState({bool: false, who: ''});
    const handleClose = () => setOpen({bool: false, who: ''});

    const allProductsGridColumns = useMemo(
        () => [
        {
            field: 'id',
            headerName: '#',
            width: 40,
            align: 'center',
            filterable: false,
            renderCell: (index) => index.api.getRowIndex(index.row.id) + 1
        }, {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            align: 'center',
            editable: true,
            renderCell: (params) => {
                return <EzText text={params.row.name} sx={{fontSize: '13px'}}/>
            }
        }, {
            field: 'image',
            headerName: 'Image',
            flex: 3,
            align: 'center',
            renderCell: (params) => {
                let addImgBtn = params.row.image.length === 4;
                return (
                    <Stack
                        onClick={_ => onImageClickHandler(params.row.image)}
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                        sx={{width: 'fit-content', cursor: 'pointer'}}
                        gap='10px'
                    >
                        <Stack flexDirection='row' sx={{height: '100%'}}>
                            {params.row.image.map(i =>
                                <img
                                    // onClick={onImageClickHandler} //delete or update
                                    key={i.id}
                                    src={i.url}
                                    alt={i.url}
                                    style={{height: '100%', width: '80px'}}
                                />
                            )}
                        </Stack>
                        <Button disabled={addImgBtn} variant="outlined" component="label" sx={{marginRight: '20px', minWidth: '46px', cursor: 'pointer'}}>
                            <input hidden accept="image/*" multiple type="file" />
                            <CameraAltIcon/>
                        </Button>
                    </Stack>
                )
            }
        }, {
            field: 'color',
            headerName: 'Color',
            flex: 1,
            align: 'center',
            renderCell: (params) => {
                let color = [];
                color = color.length ? params.row.color.map(c => color += `${c} `) : params.row.color;
                return (
                    <Stack flexDirection='row' gap='5px'>
                        {color.map((c, i) =>
                            <EzText key={c} text={(i ? ', ' : '') + c} sx={{fontSize: '13px'}}/>
                        )}
                    </Stack>
                )
            }
        }, {
            field: 'size',
            headerName: 'Size',
            flex: 1,
            align: 'center',
            renderCell: (params) => {
                return (
                    <Stack flexDirection='row' gap='5px'>
                        {params.row.size.map((s, i) =>
                            <EzText key={s} text={(i ? ', ' : '') + s} sx={{fontSize: '13px'}}/>
                        )}
                    </Stack>
                )
            }
        }, {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            align: 'center',
            editable: true,
            renderCell: (params) => {
                return (
                    <Stack flexDirection='row' gap='5px'>
                        {params.row.category.map((c, i) =>
                            <EzText key={c} text={(i ? ', ' : '') + c} sx={{fontSize: '13px'}}/>
                        )}
                    </Stack>
                )
            }
        }, {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            flex: 1,
            align: 'center',
            editable: true,
            renderCell: ({value}) => {
                return <EzText text={`$ ${value}`} sx={{fontSize: '13px'}}/>
            }
        }, {
            field: 'discount',
            headerName: 'Discount',
            type: 'number',
            flex: 1,
            align: 'center',
            editable: true,
            renderCell: (params) => {
                let tempColor = params.row.discount > 0 ? 'green' : 'red';
                return (
                    <EzText text={params.row.discount} sx={{fontSize: '13px', color: tempColor}}/>
                )
            }
        }, {
            field: 'active',
            headerName: 'Active',
            flex: 1,
            align: 'center',
            type: 'boolean',
            editable: true,
            renderCell: (params) => {
                let tempColor = params.row.active === true ? 'green' : 'red';
                return <EzText text={params.row.active? 'true' : 'false'} sx={{fontSize: '13px', color: tempColor}}/>
            }
        }, {
            field: 'action',
            headerName: 'Action',
            align: 'center',
            type: 'actions',
            sortable: false,
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                // debugger

                if(isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={_ => handleSaveClick(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={_ => handleCancelClick(params.id)}
                            color="inherit"
                        />,
                    ];
                }
                return [
                    <Tooltip title="Variants">
                        <GridActionsCellItem
                            icon={<BorderAllIcon/>}
                            label="Variants"
                            onClick={_ => {
                                setVariationGridData({
                                    ...variationGridData,
                                    variations: params.row.variation,
                                    productName: params.row.name,
                                    product: params.row
                                });
                                setOpen({bool: true, who: 'variation'})
                            }}
                            // showInMenu
                        />
                    </Tooltip>,
                    <Tooltip title="Edit">
                        <GridActionsCellItem
                            icon={<EditIcon/>}
                            label="Edit"
                            // disabled={true}
                            onClick={_ => handleEditClick(params.id)}
                            // showInMenu
                        />
                    </Tooltip>,
                    // <Tooltip title="Delete">
                    //     <GridActionsCellItem
                    //         icon={<DeleteIcon/>}
                    //         label="Delete"
                    //         onClick={_ => {
                    //             window.confirm({type: 'warning', content: 'Sure want to delete this Product?'})
                    //                 .then(res => {
                    //                     if (res) {
                    //                         setRows(prev => prev.filter(item => item.id !== params.id))
                    //                         window.displayNotification({
                    //                             title: 'Done',
                    //                             type: 'success',
                    //                             content: 'Product Deleted Successfully'
                    //                         })
                    //                     }
                    //                 })
                    //
                    //         }}
                    //
                    //     />
                    // </Tooltip>,
                ]
            },
        }
    ], [handleEditClick, handleSaveClick, handleCancelClick, rowModesModel, variationGridData]);

    return (
        <ChildLocal sx={{height: 'calc(100vh - 80px)', padding: 0}}>
            {open.bool && <EzModalWithTransition open={open.bool} handleClose={handleClose}>
                {open.who === 'variation' &&
                    <VariationGrid
                        variation={variationGridData.variations}
                        product={variationGridData.product}
                        productName={variationGridData.productName}
                    />
                }
                {open.who === 'addProduct' && <AddProduct handleClose={handleClose}/>}
                {open.who === 'swiper' &&
                    <Stack
                        sx={{
                            height: 'calc(90vh)',
                            width: '60vw',
                            maxHeight: '950px',
                            maxWidth: '768px',
                            '& .swiper': {
                                width: '100%',
                                height: '100%',
                            }
                        }}>
                        <EzSwiper allowTouchMove show data={swiperData} />
                    </Stack>
                }
            </EzModalWithTransition>}
            <Box sx={{height: '100%', width: '100%'}}>
                {row.length ?
                    <DataGrid
                        sx={tableSx}
                        rows={row}
                        columns={allProductsGridColumns}
                        getRowId={row => row.id}
                        rowHeight={120}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20]}
                        //to edit function in v5 editMode and experimentalFeatures are required
                        editMode='row'
                        onRowEditStart={handleRowEditStart}//disable edit with dbclick
                        onRowEditStop={handleRowEditStop}//disable edit with dbclick
                        experimentalFeatures={{ newEditingApi: true }}
                        onRowModesModelChange={model => setRowModesModel(model)}
                        rowModesModel={rowModesModel}
                        components={{
                            Toolbar: EzEditToolBar
                        }}
                        componentsProps={{
                            toolbar: {
                                // rowMode,
                                // selectedRowParams
                                setOpen,
                                rowModesModel,
                                setRowModesModel,
                                from: 'product'
                            },
                            // row: {
                            //     onFocus: handleRowFocus
                            // }
                        }}
                        processRowUpdate={processRowUpdate}
                        onProcessRowUpdateError={handleProcessRowUpdateError}
                        // loading={productState.loading}
                    /> : <EzButton onClick={_ => setOpen({bool: true, who: 'addProduct'})}>First Product</EzButton>
                }
            </Box>
        </ChildLocal>
    );
}
