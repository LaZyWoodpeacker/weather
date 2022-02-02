const propName = 'weatherdata';
const weatherApiKey = '5484ec107e02c3769b4d8cb3f6bb544e'
const defaultData = [{
    "id": 1486209,
    "name": "Екатеринбург"
}, {
    "id": 524901,
    "name": "Москва"
}, {
    "id": 1508291,
    "name": "Челябинск"
}];

export const getDataFromApi = async cityName => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=${weatherApiKey}`);
    if (response.status === 200) {
        return await response.json();
    } else {
        throw new Error(response.status)
    }
}

export const getDataFromStorage = () => disp => {
    const payload = JSON.parse(localStorage.getItem(propName));
    if (payload) {
        disp({ type: 'DATA_LOADED', payload });
    } else {
        localStorage.setItem(propName, JSON.stringify(defaultData));
        disp({ type: 'DATA_LOADED', payload: defaultData });
    }
}

export const addCity = cityName => async disp => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${weatherApiKey}`);
    if (response.status === 200) {
        const result = await response.json();
        if (result.count > 0) {
            const { name, id } = result.list[0];
            const storageCitys = JSON.parse(localStorage.getItem(propName));
            if (storageCitys && !storageCitys.find(e => e.id === id)) {
                const payload = [...JSON.parse(localStorage.getItem(propName)), { name, id }];
                localStorage.setItem(propName, JSON.stringify(payload));
                disp({ type: 'ADD_CITY', payload, cityName });
            } else {
                disp({ type: 'ADD_CITY_ERROR_ALREADY', cityName });
            }

        } else {
            disp({ type: 'ADD_CITY_ERROR_NOTFOUND', cityName });
        }
    } else {
        disp({ type: 'ADD_CITY_ERROR_NOTFOUND', cityName });
    }
}

export const removeCity = cityId => disp => {
    const payload = JSON.parse(localStorage.getItem(propName)).filter(city => city.id !== cityId);
    localStorage.setItem(propName, JSON.stringify(payload));
    disp({ type: 'REMOVE_CITY', payload, cityId });
}   