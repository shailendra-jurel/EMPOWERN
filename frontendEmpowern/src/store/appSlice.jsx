import {createSlice} from '@reduxjs/toolkit'

const  initialState = {

    userId : '',
    selectedQuipmentId : '',
    selectedJob : '',
    machineCategor : '',
    machineId : ' ',
    MachineOwnerId : '',
    BorrowerId: '',
    RenteeId : '',
    contractorId :  '',
    projectId : '',
    workerId : '',
    jobAssignmentId : '' ,
    
}

const appSlice = createSlice({
    name : 'app',
    initialState,

    reducers : {

        setUserId(state ,action){
            state.userId  = action.payload;
        },

        setSelectQuipmentId(state , action){
            state.selectedQuipmentId  = action.payload;

        },

        setSelectedJob(state , action){
            state.selectedJob = action.payload;
        },
        setMachineId(state , action){
            state.machineId =  action.payload;
        },
        setMachineCategory(state , action){
            state.machineCategor = action.payload;
        },
        setMachineOwnerId(state , action){
            state.MachineOwnerId = action.payload;
        },
        setBorrowerId(state ,action){
            state.BorrowerId  = action.payload;
        },
        setRenteeId (state, action){
            state.RenteeId = action.payload;
        },
        setContractorId (state ,action){
            state.contractorId = action.payload;
        },
        setProjectId (state ,action){
            state.projectId = action.payload;
        },
        setWokerId (state ,action){
            state.workerId = action.payload;

        },

        setJobAssignId (state , action){
            state.jobAssignmentId = action.payload;
        },


    },
});


export const {
    setUserId, setBorrowerId , setContractorId ,
    setJobAssignId  , setMachineCategory , setProjectId ,
    setRenteeId , setMachineOwnerId , setSelectQuipmentId ,
    setSelectedJob , setWokerId, setMachineId,}  = appSlice.actions

export default appSlice.reducer;