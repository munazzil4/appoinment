import { action, thunk } from 'easy-peasy'
import { apiUrl,fallbackApi } from '../utils/api'

export default {
  items: fallbackApi, //to work offline
  //? Thunks
  fetchDoctors: thunk(async actions => {
    const res = await fetch(apiUrl)
    let items=fallbackApi
    if (res.ok){
      items = await res.json()
    }
    actions.setDoctorsList(items)


  }),

  //? action
  setDoctorsList: action((state, items) => {
    state.items = items
  }),

  //Select Single Doctor
  selectedDoctor: '',
  submitAppoinment: action((state, selectedDoctor) => {
    state.selectedDoctor = selectedDoctor
    localStorage.setItem('currentDoctor', JSON.stringify(state.selectedDoctor));
  }),
  //Appoinment Modal
  showDialog: false,
  setDialog: action((state) => {
    state.showDialog = !state.showDialog;
  }),
  //Delete Appoinment
  showdeleteDialog: false,
  setdeleteDialog: action((state) => {
    state.showdeleteDialog = !state.showdeleteDialog;
  }),

}