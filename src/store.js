import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


function reducer(state, action) {
    switch (action.type) {
        case 'DATA_LOADED':
            return { ...state, places: action.payload };
        case 'REMOVE_CITY':
            return { ...state, notify: `Город удалён ${action.cityId}`, places: action.payload };
        case 'ADD_CITY':
            return { ...state, notify: `Добавлен город ${action.cityName}`, places: action.payload };
        case 'ADD_CITY_ERROR_ALREADY':
            return { ...state, notify: `Город ${action.cityName} уже добавлен` };
        case 'ADD_CITY_ERROR_NOTFOUND':
            return { ...state, notify: `Город ${action.cityName} не найден` };
        default:
            return state
    }
}

export default createStore(reducer, applyMiddleware(thunk));